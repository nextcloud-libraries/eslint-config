/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'

const defineRule = (r: Rule.RuleModule) => r

export default defineRule({
	meta: {
		fixable: 'code',
		type: 'suggestion',
		schema: [],
		docs: {
			description: 'Enforce consistent translation format for Nextcloud',
		},
	},

	create(context) {
		return {
			Literal(node) {
				if (typeof node.value !== 'string'
					|| node.parent.type !== 'CallExpression'
					|| node.parent.callee.type !== 'Identifier'
					|| node.parent.callee.name !== 't'
				) {
					return
				}

				if (node.raw?.match(/(?<=[^.])\.\.\.(?!\.)/)) {
					context.report({
						node,
						message: 'Strings should ellipsis instead of triple dots',
						fix(fixer) {
							return fixer.replaceText(node, node.raw!.replaceAll(/(?<=[^.])\.\.\.(?!\.)/g, '…'))
						},
					})
				}
			},
		}
	},
})
