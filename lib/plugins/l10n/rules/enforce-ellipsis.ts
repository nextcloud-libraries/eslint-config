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
			description: 'Enforce consistent usageof ellipsis instead of tripple dots',
		},
		messages: {
			shoudUseEllipsis: 'Translated strings should use ellipsis character instead of triple dots',
		}
	},

	create(context) {
		return {
			CallExpression(node) {
				if (node.callee.type !== 'Identifier'
					|| (node.callee.name !== 't' && node.callee.name !== 'n')
				) {
					return
				}

				for (const argument of node.arguments) {
					if (argument.type !== 'Literal') {
						continue
					}

					if (argument.raw?.match(/(?<=[^.])\.\.\.(?!\.)/)) {
						context.report({
							node,
							messageId: 'shoudUseEllipsis',
							fix(fixer) {
								return fixer.replaceText(argument, argument.raw!.replaceAll(/(?<=[^.])\.\.\.(?!\.)/g, '…'))
							},
						})
					}
				}
			},
		}
	},
})
