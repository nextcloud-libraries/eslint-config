/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

const EVENT_BUS = '@nextcloud/event-bus'

type CallExpression = Parameters<NonNullable<Rule.NodeListener['CallExpression']>>[0]

type Method = 'emit' | 'broadcast'

interface ScopeCalls {
	emits: { name: string, node: CallExpression }[]
	broadcasts: Set<string>
}

/*
 broadcast() also emits in the current tab since @nextcloud/event-bus v3.4.0
 */
const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		fixable: 'code',
		schema: [],
		docs: {
			description: 'Disallow emit() for an event that is also broadcast(), broadcast() already emits in the current tab',
			recommended: true,
		},
		messages: {
			emitAndBroadcast: 'broadcast() already emits "{{name}}" in the current tab, remove this emit()',
		},
	},

	create(context) {
		// Local names of the imports from @nextcloud/event-bus
		const methods = new Map<string, Method>()
		const namespaces = new Set<string>()
		const calls = new Map<Rule.Node, ScopeCalls>()

		/**
		 * Which event bus method a call uses, if any
		 *
		 * @param node - The call
		 */
		function getMethod(node: CallExpression): Method | undefined {
			const { callee } = node
			if (callee.type === 'Identifier') {
				return methods.get(callee.name)
			}
			if (callee.type === 'MemberExpression'
				&& callee.object.type === 'Identifier'
				&& namespaces.has(callee.object.name)
				&& callee.property.type === 'Identifier'
				&& !callee.computed
				&& (callee.property.name === 'emit' || callee.property.name === 'broadcast')) {
				return callee.property.name
			}
			return undefined
		}

		/**
		 * The event name of a call, only when it is a static string
		 *
		 * @param node - The call
		 */
		function getEventName(node: CallExpression): string | undefined {
			const [argument] = node.arguments
			if (argument?.type === 'Literal' && typeof argument.value === 'string') {
				return argument.value
			}
			if (argument?.type === 'TemplateLiteral' && argument.expressions.length === 0) {
				return argument.quasis[0]!.value.cooked ?? undefined
			}
			return undefined
		}

		/**
		 * The closest function around a node, or the program
		 *
		 * @param node - The call
		 */
		function getScope(node: CallExpression): Rule.Node {
			const ancestors = context.sourceCode.getAncestors(node) as Rule.Node[]
			return ancestors.findLast((ancestor) => ancestor.type === 'FunctionDeclaration'
				|| ancestor.type === 'FunctionExpression'
				|| ancestor.type === 'ArrowFunctionExpression') ?? ancestors[0]!
		}

		/**
		 * Remove the statement of an emit() call along with its line
		 *
		 * @param node - The emit() call
		 */
		function fix(node: CallExpression): Rule.ReportFixer | undefined {
			const statement = node.parent
			if (statement.type !== 'ExpressionStatement') {
				return undefined
			}

			const text = context.sourceCode.getText()
			let [start, end] = statement.range!
			while (start > 0 && (text[start - 1] === '\t' || text[start - 1] === ' ')) {
				start--
			}
			if (text[end] === '\n') {
				end++
			}
			return (fixer) => fixer.removeRange([start, end])
		}

		return {
			ImportDeclaration(node) {
				if (node.source.value !== EVENT_BUS) {
					return
				}
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportNamespaceSpecifier') {
						namespaces.add(specifier.local.name)
					} else if (specifier.type === 'ImportSpecifier'
						&& specifier.imported.type === 'Identifier'
						&& (specifier.imported.name === 'emit' || specifier.imported.name === 'broadcast')) {
						methods.set(specifier.local.name, specifier.imported.name)
					}
				}
			},

			CallExpression(node) {
				const method = getMethod(node)
				const name = method && getEventName(node)
				if (!name) {
					return
				}

				const scope = getScope(node)
				if (!calls.has(scope)) {
					calls.set(scope, { emits: [], broadcasts: new Set() })
				}
				const scopeCalls = calls.get(scope)!
				if (method === 'emit') {
					scopeCalls.emits.push({ name, node })
				} else {
					scopeCalls.broadcasts.add(name)
				}
			},

			'Program:exit': function() {
				for (const { emits, broadcasts } of calls.values()) {
					for (const { name, node } of emits) {
						if (broadcasts.has(name)) {
							context.report({
								node,
								messageId: 'emitAndBroadcast',
								data: { name },
								fix: fix(node),
							})
						}
					}
				}
			},
		}
	},
}

export default rule
