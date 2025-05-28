/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'

import * as vueUtils from 'eslint-plugin-vue/lib/utils/index.js'

export default {
	meta: {
		docs: {
			description: 'Deprecated `@nextcloud/vue` properties',
		},
		type: 'problem',
		fixable: 'code',
		messages: {
			useTypeInstead: 'Using `native-type` for button variant is deprecated - use `type` instead.',
			useVariantInstead: 'Using `type` for button variant is deprecated - use `variant` instead.',
		},
	},

	create(context) {
		const legacyTypes = ['primary', 'error', 'warning', 'success', 'secondary', 'tertiary', 'tertiary-no-background']

		return vueUtils.defineTemplateBodyVisitor(context, {
			'VElement[name="ncbutton"] VAttribute:has(VIdentifier[name="type"])': function(node) {
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

			'VElement[name="ncbutton"] VAttribute:has(VIdentifier[name="native-type"])': function(node) {
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
		})
	},
} satisfies Rule.RuleModule
