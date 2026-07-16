/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'
import type { AST } from 'vue-eslint-parser'

import { createLibVersionValidator } from '../utils/lib-version-parser.ts'
import { defineTemplateBodyVisitor } from '../utils/vue-template-visitor.ts'

/*
 * Deprecated props can be authored in either kebab-case or camelCase:
 * - camelCase is forced by `vue/attribute-hyphenation: never` shipped rule;
 * - kebab-case might come from legacy code and other presets.
 * A single `VAttribute` visitor normalizes the raw attribute name with `toCamelCase()`
 * and dispatches to the handler registered under the canonical camelCase name.
 */

/**
 * Convert an attribute name to camelCase, matching Vue's own prop normalization,
 * so a template attribute written in either casing maps to a single canonical name.
 *
 * @param name - the raw attribute name as written in the template
 */
const toCamelCase = (name: string) => name.replace(/-(\w)/g, (_, char) => char.toUpperCase())

/**
 * Resolve the raw (case-preserving) name of a template attribute: the argument
 * for a directive binding (`:foo` / `v-model:foo`), or the key otherwise.
 * Returns `undefined` when there is no static name (e.g. a dynamic argument).
 *
 * Must use `rawName`, not `name`: Vue lowercases `name` in the AST (`focusTrap`
 * becomes `focustrap`), which `toCamelCase()` cannot restore, so it would no
 * longer match the camelCase handler key. `rawName` keeps the original casing.
 *
 * @param node - the attribute or directive node
 */
function getRawName(node: AST.VAttribute | AST.VDirective): string | undefined {
	if (node.key.type === 'VDirectiveKey') {
		return node.key.argument?.type === 'VIdentifier' ? node.key.argument.rawName : undefined
	}

	return node.key.rawName
}

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
			useNoCloseOnClickOutsideInstead: 'Using `close-on-click-outside` is deprecated - use `no-close-on-click-outside` instead',
			useDisableSwipeForModalInstead: 'Using `enable-swipe` is deprecated - use `disable-swipe` instead',
			useNoFocusTrapInstead: 'Using `focus-trap` is deprecated - use `no-focus-trap` instead',
			useKeepOpenInstead: 'Using `close-on-select` is deprecated - use `keep-open` instead',
			useNcSelectUsersInstead: 'Using `user-select` is deprecated - use `NcSelectUsers` component instead',
			useArrowEndInstead: 'Using `arrowRight` as `trailing-button-icon` value is deprecated - use `arrowEnd` instead',
			removeAriaHidden: 'Using `aria-hidden` is deprecated - remove prop from components, otherwise root element will inherit incorrect attribute.',
			removeLimitWidth: 'Using `limit-width` is deprecated - remove prop from components, otherwise root element will inherit incorrect attribute.',
			removeExact: 'Using `exact` is deprecated - consult Vue Router documentation for alternatives.',
			useCloseButtonOutsideInstead: 'Using `close-button-contained` is deprecated - use `close-button-outside` instead',
			useModelValueInsteadChecked: 'Using `checked` is deprecated - use `model-value` or `v-model` instead',
			useModelValueInsteadValue: 'Using `value` is deprecated - use `model-value` or `v-model` instead',
			useHideLabelInstead: 'Using `label-hidden` is deprecated - use `hide-label` instead',
			useNcRadioGroupInstead: 'Using `button-variant` / `button-variant-grouped` is deprecated - use the `NcRadioGroup` component instead',
			useLabelInstead: 'Using `title` is deprecated - use `label` instead',
			removeLegacy: 'Using `legacy` is deprecated - the legacy design will be removed, migrate to the new design',
		},
	},

	create(context) {
		const versionSatisfies = createLibVersionValidator(context)
		const isVue3Valid = versionSatisfies('9.0.0') // #6651
		const isAriaHiddenValid = versionSatisfies('8.2.0') // #4835 (stable8)
		const isModelValueValid = versionSatisfies('8.20.0') // #6172 (stable8)
		const isDisableSwipeValid = versionSatisfies('8.23.0', '9.0.0') // #6452 (stable8) / #6509 (main)
		const isVariantTypeValid = versionSatisfies('8.24.0', '9.0.0') // #6472 (stable8) / #6595 (main)
		const isDefaultBooleanFalseValid = versionSatisfies('8.24.0', '9.0.0') // #6656 (stable8) / #6653 (main)
		const isDateTimePickerFormatValid = versionSatisfies('8.25.0', '9.0.0') // #6738 (stable8) / #6651 (main)
		const isNcSelectKeepOpenValid = versionSatisfies('8.25.0', '9.0.0') // #6791 (stable8) / #6732 (main)
		const isNcPopoverNoFocusTrapValid = versionSatisfies('8.26.0', '9.0.0') // #6808 (stable8) / #6807 (main)
		const isNcSelectUsersValid = versionSatisfies('8.25.0', '9.0.0') // #6791 (stable8) / #6732 (main)
		const isNcTextFieldArrowEndValid = versionSatisfies('8.28.0', '9.0.0') // #7002 (stable8) / #6993 (main)
		const isCloseButtonOutsideValid = versionSatisfies('8.32.0', '9.0.0') // #7553 (stable8) / #6719 (main)
		const isTitleLabelValid = versionSatisfies('8.6.2', '9.0.0') // #5215 (stable8)
		const isNcRadioGroupValid = versionSatisfies('8.31.0', '9.0.0') // #7492 (stable8) / #7490 (main)
		const isHideLabelValid = versionSatisfies('8.34.0', '9.2.0') // #7772 (stable8) / #7771 (main)
		const isAppSettingsLegacyValid = versionSatisfies('8.34.0', '9.2.0') // #7802 (stable8) / #7797 (main)

		const legacyTypes = [
			'primary',
			'error',
			'warning',
			'success',
			'secondary',
			'tertiary',
			'tertiary-no-background',
		]

		/*
		 * Deprecated prop handlers keyed by their canonical camelCase name. Each
		 * handler receives the matched attribute node and verifies the owning
		 * component and installed library version itself.
		 */
		const handlers: Record<string, (node: AST.VAttribute | AST.VDirective) => void> = {
			type: function(node) {
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

				const hasNativeType = node.parent.attributes.some((attr) => {
					const rawName = getRawName(attr)
					return rawName !== undefined && toCamelCase(rawName) === 'nativeType'
				})

				const isLiteral = node.value.type === 'VLiteral' && legacyTypes.includes(node.value.value)
				const isExpression = node.value.type === 'VExpressionContainer'
					&& node.value.expression.type === 'ConditionalExpression'
					&& (('value' in node.value.expression.consequent && legacyTypes.includes(node.value.expression.consequent.value.toString()))
						|| ('value' in node.value.expression.alternate && legacyTypes.includes(node.value.expression.alternate.value.toString()))
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

			nativeType: function(node) {
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

			ariaHidden: function(node) {
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

			allowSwipeNavigation: function(node) {
				if (node.parent.parent.name !== 'ncappcontent') {
					return
				}

				if (!isDisableSwipeValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useDisableSwipeForNavInstead',
				})
			},

			showUserStatus: function(node) {
				if (node.parent.parent.name !== 'ncavatar') {
					return
				}

				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useHideStatusInstead',
				})
			},

			showUserStatusCompact: function(node) {
				if (node.parent.parent.name !== 'ncavatar') {
					return
				}

				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useVerboseStatusInstead',
				})
			},

			allowPlaceholder: function(node) {
				if (node.parent.parent.name !== 'ncavatar') {
					return
				}

				if (!isDefaultBooleanFalseValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNoPlaceholderInstead',
				})
			},

			formatter: function(node) {
				if (node.parent.parent.name !== 'ncdatetimepicker') {
					return
				}

				if (!isDateTimePickerFormatValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useFormatInstead',
				})
			},

			lang: function(node) {
				if (node.parent.parent.name !== 'ncdatetimepicker') {
					return
				}

				if (!isVue3Valid) {
					// Do not throw for v8.X.X
					return
				}

				context.report({
					node,
					messageId: 'useLocaleInstead',
				})
			},

			range: function(node) {
				if (node.parent.parent.name !== 'ncdatetimepicker') {
					return
				}

				if (!isDateTimePickerFormatValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useTypeDateRangeInstead',
				})
			},

			canClose: function(node) {
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

			closeOnClickOutside: function(node) {
				if (node.parent.parent.name !== 'ncpopover') {
					return
				}

				if (!isVue3Valid) {
					// Do not throw for v8.X.X
					return
				}

				context.report({
					node,
					messageId: 'useNoCloseOnClickOutsideInstead',
				})
			},

			enableSwipe: function(node) {
				if (node.parent.parent.name !== 'ncmodal') {
					return
				}

				if (!isDisableSwipeValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useDisableSwipeForModalInstead',
				})
			},

			closeButtonContained: function(node) {
				if (node.parent.parent.name !== 'ncmodal') {
					return
				}

				if (!isCloseButtonOutsideValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useCloseButtonOutsideInstead',
				})
			},

			focusTrap: function(node) {
				if (node.parent.parent.name !== 'ncpopover') {
					return
				}

				if (!isNcPopoverNoFocusTrapValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNoFocusTrapInstead',
				})
			},

			closeOnSelect: function(node) {
				if (node.parent.parent.name !== 'ncselect') {
					return
				}

				if (!isNcSelectKeepOpenValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useKeepOpenInstead',
				})
			},

			userSelect: function(node) {
				if (node.parent.parent.name !== 'ncselect') {
					return
				}

				if (!isNcSelectUsersValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNcSelectUsersInstead',
				})
			},

			trailingButtonIcon: function(node) {
				if (node.parent.parent.name !== 'nctextfield') {
					return
				}

				if (!isNcTextFieldArrowEndValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				const isLiteral = node.value.type === 'VLiteral' && node.value.value === 'arrowRight'

				const isExpression = node.value.type === 'VExpressionContainer'
					&& node.value.expression?.type === 'ConditionalExpression'
					&& (
						('value' in node.value.expression.consequent && node.value.expression.consequent.value === 'arrowRight')
						|| ('value' in node.value.expression.alternate && node.value.expression.alternate.value === 'arrowRight')
					)

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
								const expression = (node.value as AST.VExpressionContainer).expression as AST.ESLintConditionalExpression
								return (expression.consequent as AST.ESLintLiteral).value === 'arrowRight'
									? fixer.replaceTextRange(expression.consequent.range, '\'arrowEnd\'')
									: fixer.replaceTextRange(expression.alternate.range, '\'arrowEnd\'')
							}
						},
					})
				}
			},

			limitWidth: function(node) {
				if (node.parent.parent.name !== 'ncsettingssection') {
					return
				}

				// This was deprecated in 8.12.0 (Nextcloud 30+), before first supported version by plugin
				context.report({
					node,
					messageId: 'removeLimitWidth',
				})
			},

			exact: function(node) {
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

			checked: function(node) {
				if (![
					'ncactioncheckbox',
					'ncactionradio',
					'nccheckboxradioswitch',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isModelValueValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useModelValueInsteadChecked',
					fix: (fixer) => {
						if (node.key.type === 'VIdentifier') {
							return fixer.replaceTextRange(node.key.range, 'model-value')
						} else if (node.key.type === 'VDirectiveKey') {
							if (node.key.name.name === 'model') {
								return fixer.replaceTextRange(node.key.range, 'v-model')
							} else if (node.key.modifiers.some((m) => m.name === 'sync')) {
								return fixer.replaceTextRange(node.key.range, 'v-model')
							} else {
								return fixer.replaceTextRange(node.key.argument.range, 'model-value')
							}
						}
					},
				})
			},

			labelHidden: function(node) {
				if (node.parent.parent.name !== 'ncradiogroup') {
					return
				}

				if (!isHideLabelValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useHideLabelInstead',
					fix: (fixer) => {
						if (node.key.type === 'VIdentifier') {
							return fixer.replaceTextRange(node.key.range, 'hide-label')
						} else if (node.key.type === 'VDirectiveKey') {
							return fixer.replaceTextRange(node.key.argument.range, 'hide-label')
						}
					},
				})
			},

			buttonVariant: function(node) {
				if (node.parent.parent.name !== 'nccheckboxradioswitch') {
					return
				}

				if (!isNcRadioGroupValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useNcRadioGroupInstead',
				})
			},

			// Same correction as `button-variant`
			buttonVariantGrouped(node) {
				handlers.buttonVariant(node)
			},

			title: function(node) {
				if (![
					'ncautocompleteresult',
					'ncmentionbubble',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isTitleLabelValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useLabelInstead',
					fix: (fixer) => {
						if (node.key.type === 'VIdentifier') {
							return fixer.replaceTextRange(node.key.range, 'label')
						} else if (node.key.type === 'VDirectiveKey') {
							return fixer.replaceTextRange(node.key.argument.range, 'label')
						}
					},
				})
			},

			legacy: function(node) {
				if (node.parent.parent.name !== 'ncappsettingsdialog') {
					return
				}
				if (!isAppSettingsLegacyValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'removeLegacy',
				})
			},

			value: function(node) {
				if (![
					'ncactioninput',
					'ncactiontexteditable',
					'nccolorpicker',
					'ncdatetimepicker',
					'ncdatetimepickernative',
					'ncinputfield',
					'nctextfield',
					'ncpasswordfield',
					'ncrichcontenteditable',
					'ncselecttags',
					'ncselect',
					'ncsettingsinputtext',
					'ncsettingsselectgroup',
					'nctextarea',
					'nctimezonepicker',
				].includes(node.parent.parent.name)) {
					return
				}

				if (!isModelValueValid) {
					context.report({ node, messageId: 'outdatedVueLibrary' })
					return
				}

				context.report({
					node,
					messageId: 'useModelValueInsteadValue',
					fix: (fixer) => {
						if (node.key.type === 'VIdentifier') {
							return fixer.replaceTextRange(node.key.range, 'model-value')
						} else if (node.key.type === 'VDirectiveKey') {
							if (node.key.name.name === 'model') {
								return fixer.replaceTextRange(node.key.range, 'v-model')
							} else if (node.key.modifiers.some((m) => m.name === 'sync')) {
								return fixer.replaceTextRange(node.key.range, 'v-model')
							} else {
								return fixer.replaceTextRange(node.key.argument.range, 'model-value')
							}
						}
					},
				})
			},
		}

		return defineTemplateBodyVisitor(context, {
			VAttribute(node: AST.VAttribute | AST.VDirective) {
				const rawName = getRawName(node)
				if (rawName === undefined) {
					return
				}

				handlers[toCamelCase(rawName)]?.(node)
			},
		})
	},
} satisfies Rule.RuleModule
