/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import { defineTemplateBodyVisitor } from '../utils/vue-template-visitor.ts'

const defineRule = (r: Rule.RuleModule) => r

export default defineRule({
	meta: {
		fixable: 'code',
		type: 'suggestion',
		schema: [],
		docs: {
			description: 'Enforce non-breaking spaces before ellipsis',
		},
		messages: {
			precedeWithNonbreakingSpace: 'Ellipsis must be preceded by non-breaking spaces',
		},
	},

	create(context) {
		const visitor: Rule.NodeListener = {
			Literal(node) {
				if (typeof node.value !== 'string') {
					return
				}

				const matches = node.value.match(/(\s+)…/)
				if (matches && matches[1] !== ' ') {
					context.report({
						node,
						messageId: 'precedeWithNonbreakingSpace',
						fix(fixer) {
							return fixer.replaceText(node, node.raw.replaceAll(/\s+…/g, ' …'))
						},
					})
				}
			},
		}

		return defineTemplateBodyVisitor(context, visitor, visitor)
	},
})
