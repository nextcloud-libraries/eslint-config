/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'

import * as vueUtils from 'eslint-plugin-vue/lib/utils/index.js'
import { createLibVersionValidator } from '../utils/lib-version-parser.ts'

export default {
	meta: {
		docs: {
			description: 'Deprecated `@nextcloud/vue` properties',
		},
		type: 'problem',
		fixable: 'code',
		messages: {
			outdatedVueLibrary: 'Installed @nextcloud/vue library is outdated and does not support all reported errors. Install latest compatible version',
			useTypeInstead: 'Using `native-type` for button variant is deprecated - use `type` instead.',
			useVariantInstead: 'Using `type` for button variant is deprecated - use `variant` instead.',
			useDisableSwipeForNavInstead: 'Using `allow-swipe-navigation` is deprecated - use `disable-swipe` instead',
			useHideStatusInstead: 'Using `show-user-status` is deprecated - use `hide-status` instead',
			useVerboseStatusInstead: 'Using `show-user-status-compact` is deprecated - use `verbose-status` instead',
			useNoPlaceholderInstead: 'Using `allow-placeholder` is deprecated - use `no-placeholder` instead',
			useFormatInstead: 'Using `formatter` is deprecated - use `format` instead',
			useLocaleInstead: 'Using `lang` is deprecated - use `locale` instead',
			useTypeDateRangeInstead: 'Using `range` is deprecated - use `type` with `date-range` or `datetime-range` instead',
			useNoCloseInstead: 'Using `can-close` is deprecated - use `no-close` instead',
			useDisableSwipeForModalInstead: 'Using `enable-swipe` is deprecated - use `disable-swipe` instead',
			useNoFocusTrapInstead: 'Using `focus-trap` is deprecated - use `no-focus-trap` instead',
			useKeepOpenInstead: 'Using `close-on-select` is deprecated - use `keep-open` instead',
			useNcSelectUsersInstead: 'Using `user-select` is deprecated - use `NcSelectUsers` component instead',
			useArrowEndInstead: 'Using `arrow-right` is deprecated - use `arrow-end` instead',
			removeAriaHidden: 'Using `aria-hidden` is deprecated - remove prop from components, otherwise root element will inherit incorrect attribute.',
			removeLimitWidth: 'Using `limit-width` is deprecated - remove prop from components, otherwise root element will inherit incorrect attribute.',
			removeExact: 'Using `exact` is deprecated - consult Vue Router documentation for alternatives.',
			useCloseButtonOutsideInstead: 'Using `close-button-contained` is deprecated - use `close-button-outside` instead',
		},
	},

	create(context) {
		const versionSatisfies = createLibVersionValidator(context)
		const isVue3Valid = versionSatisfies('9.0.0') // #6651
		const isAriaHiddenValid = versionSatisfies('8.2.0') // #4835
		const isDisableSwipeValid = versionSatisfies('8.23.0') // #6452
		const isVariantTypeValid = versionSatisfies('8.24.0') // #6472
		const isDefaultBooleanFalseValid = versionSatisfies('8.24.0') // #6656
		const isDateTimePickerFormatValid = versionSatisfies('8.25.0') // #6738
		const isNcSelectKeepOpenValid = versionSatisfies('8.25.0') // #6791
		const isNcPopoverNoFocusTrapValid = versionSatisfies('8.26.0') // #6808
		const isNcSelectUsersValid = versionSatisfies('8.27.1') // #7032
		const isNcTextFieldArrowEndValid = versionSatisfies('8.28.0') // #7002
		const isCloseButtonOutsideValid = versionSatisfies('8.32.0') // #7553

		const legacyTypes = ['primary', 'error', 'warning', 'success', 'secondary', 'tertiary', 'tertiary-no-background']

		return vueUtils.defineTemplateBodyVisitor(context, {
			'VElement VAttribute:has(VIdentifier[name="type"])': function(node) {
				if (![
					'ncactions',
					'ncappnavigationnew',
					'ncbutton',
					'ncchip',
					'ncdialogbutton',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isVariantTypeValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				const hasNativeType = node.parent.attributes.find((attr) => (
					attr.key.name === 'native-type'
					|| (attr.key.type === 'VDirectiveKey' && attr.key.argument && attr.key.argument.name === 'native-type')))

				const isLiteral = node.value.type === 'VLiteral' && legacyTypes.includes(node.value.value)
				const isExpression = node.value.type === 'VExpressionContainer'
					&& node.value.expression.type === 'ConditionalExpression'
					&& (legacyTypes.includes(node.value.expression.consequent.value)
						|| legacyTypes.includes(node.value.expression.alternate.value)
					)

				/**
				 * if it is a literal with a deprecated value -> we migrate
				 * if it is an expression with a defined deprecated value -> we migrate
				 * if it is unknown value (e.g. computed), but there is also the `native-type` we assume it is legacy and we migrate
				 */
				if (isLiteral || isExpression || hasNativeType) {
					context.report({
						node,
						messageId: 'useVariantInstead',
						fix: (fixer) => {
							if (node.key.type === 'VIdentifier') {
								return fixer.replaceTextRange(node.key.range, 'variant')
							} else if (node.key.type === 'VDirectiveKey') {
								return fixer.replaceTextRange(node.key.argument.range, 'variant')
							}
						},
					})
				}
			},

			'VElement VAttribute:has(VIdentifier[name="native-type"])': function(node) {
				if (![
					'ncbutton',
					'ncdialogbutton',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isVariantTypeValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useTypeInstead',
					fix: (fixer) => {
						if (node.key.type === 'VIdentifier') {
							return fixer.replaceTextRange(node.key.range, 'type')
						} else if (node.key.type === 'VDirectiveKey') {
							return fixer.replaceTextRange(node.key.argument.range, 'type')
						}
					},
				})
			},

			'VElement VAttribute:has(VIdentifier[name="aria-hidden"])': function(node) {
				if (node.parent.parent.name.startsWith('ncaction')
					|| node.parent.parent.name === 'ncbutton') {
					if (!isAriaHiddenValid) {
						context.report({ node, messageId: 'outdatedVueLibrary' })
						return
					}

					context.report({
						node,
						messageId: 'removeAriaHidden',
					})
				}
			},

			'VElement[name="ncappcontent"] VAttribute:has(VIdentifier[name="allow-swipe-navigation"])': function(node) {
				if (!isDisableSwipeValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useDisableSwipeForNavInstead',
				})
			},

			'VElement[name="ncavatar"] VAttribute:has(VIdentifier[name="show-user-status"])': function(node) {
				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useHideStatusInstead',
				})
			},

			'VElement[name="ncavatar"] VAttribute:has(VIdentifier[name="show-user-status-compact"])': function(node) {
				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useVerboseStatusInstead',
				})
			},

			'VElement[name="ncavatar"] VAttribute:has(VIdentifier[name="allow-placeholder"])': function(node) {
				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNoPlaceholderInstead',
				})
			},

			'VElement[name="ncdatetimepicker"] VAttribute:has(VIdentifier[name="formatter"])': function(node) {
				if (!isDateTimePickerFormatValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useFormatInstead',
				})
			},

			'VElement[name="ncdatetimepicker"] VAttribute:has(VIdentifier[name="lang"])': function(node) {
				if (!isVue3Valid) {
					// Do not throw for v8.X.X
					return
				}

				context.report({
					node,
					messageId: 'useLocaleInstead',
				})
			},

			'VElement[name="ncdatetimepicker"] VAttribute:has(VIdentifier[name="range"])': function(node) {
				if (!isDateTimePickerFormatValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useTypeDateRangeInstead',
				})
			},

			'VElement VAttribute:has(VIdentifier[name="can-close"])': function(node) {
				if (![
					'ncdialog',
					'ncmodal',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNoCloseInstead',
				})
			},

			'VElement[name="ncmodal"] VAttribute:has(VIdentifier[name="enable-swipe"])': function(node) {
				if (!isDisableSwipeValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useDisableSwipeForModalInstead',
				})
			},

			'VElement[name="ncmodal"] VAttribute:has(VIdentifier[name="close-button-contained"])': function(node) {
				if (!isCloseButtonOutsideValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useCloseButtonOutsideInstead',
				})
			},

			'VElement[name="ncpopover"] VAttribute:has(VIdentifier[name="focus-trap"])': function(node) {
				if (!isNcPopoverNoFocusTrapValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNoFocusTrapInstead',
				})
			},

			'VElement[name="ncselect"] VAttribute:has(VIdentifier[name="close-on-select"])': function(node) {
				if (!isNcSelectKeepOpenValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useKeepOpenInstead',
				})
			},

			'VElement[name="ncselect"] VAttribute:has(VIdentifier[name="user-select"])': function(node) {
				if (!isNcSelectUsersValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNcSelectUsersInstead',
				})
			},

			'VElement VAttribute:has(VIdentifier[name="trailing-button-icon"])': function(node) {
				if (node.parent.parent.name !== 'nctextfield') {
					return
				}

				if (!isNcTextFieldArrowEndValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				const isLiteral = node.value.type === 'VLiteral' && node.value.value === 'arrowRight'

				const isExpression = node.value.type === 'VExpressionContainer' && node.value.expression?.type === 'ConditionalExpression'
					&& (node.value.expression.consequent.value === 'arrowRight' || node.value.expression.alternate.value === 'arrowRight')

				/**
				 * if it is a literal with a deprecated value -> we migrate
				 * if it is an expression with a defined deprecated value -> we migrate
				 */
				if (isLiteral || isExpression) {
					context.report({
						node,
						messageId: 'useArrowEndInstead',
						fix: (fixer) => {
							if (node.key.type === 'VIdentifier') {
								return fixer.replaceTextRange(node.value.range, '"arrowEnd"')
							} else if (node.key.type === 'VDirectiveKey') {
								return (node.value.expression.consequent.value === 'arrowRight')
									? fixer.replaceTextRange(node.value.expression.consequent.range, '\'arrowEnd\'')
									: fixer.replaceTextRange(node.value.expression.alternate.range, '\'arrowEnd\'')
							}
						},
					})
				}
			},

			'VElement[name="ncsettingssection"] VAttribute:has(VIdentifier[name="limit-width"])': function(node) {
				// This was deprecated in 8.13.0 (Nextcloud 30+), before first supported version by plugin
				context.report({
					node,
					messageId: 'removeLimitWidth',
				})
			},

			'VElement VAttribute:has(VIdentifier[name="exact"])': function(node) {
				if (![
					'ncactionrouter',
					'ncappnavigationitem',
					'ncbreadcrumb',
					'ncbutton',
					'nclistitem',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isVue3Valid) {
					// Do not throw for v8.X.X
					return
				}

				context.report({
					node,
					messageId: 'removeExact',
				})
			},
		})
	},
} satisfies Rule.RuleModule
