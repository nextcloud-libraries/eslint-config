/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import { extname } from 'node:path'

type TemplateVisitor = { [key: string]: (...args: unknown[]) => void }

type TemplateVisitorOptions = { templateBodyTriggerSelector: 'Program' | 'Program:exit' }

/**
 * @see https://github.com/vuejs/vue-eslint-parser/blob/5ff1a4fda76b07608cc17687a976c2309f5648e2/src/parser-services.ts#L46
 */
interface ParserServices {
	/**
	 * Define handlers to traverse the template body.
	 *
	 * @param templateBodyVisitor The template body handlers.
	 * @param scriptVisitor The script handlers.
	 * @param options The options.
	 */
	defineTemplateBodyVisitor(
		templateBodyVisitor: TemplateVisitor,
		scriptVisitor?: Rule.NodeListener,
		options?: TemplateVisitorOptions,
	): Rule.RuleListener
}

/**
 * Register the given visitor to parser services.
 * If the parser service of `vue-eslint-parser` was not found,
 * this generates a warning.
 *
 * @param context - The rule context to use parser services.
 * @param templateBodyVisitor - The visitor to traverse the template body.
 * @param scriptVisitor - The visitor to traverse the script.
 * @param options - The options.
 *
 * @return The merged visitor.
 * @see https://github.com/vuejs/eslint-plugin-vue/blob/745fd4e1f3719c3a2f93bd3531da5e886c16f008/lib/utils/index.js#L2281-L2315
 */
export function defineTemplateBodyVisitor(context: Rule.RuleContext, templateBodyVisitor: TemplateVisitor, scriptVisitor?: Rule.RuleListener, options?: TemplateVisitorOptions) {
	const sourceCode = context.sourceCode
	if (!sourceCode.parserServices?.defineTemplateBodyVisitor) {
		const filename = context.filename
		if (extname(filename) === '.vue') {
			context.report({
				loc: {
					line: 1,
					column: 0,
				},
				message: 'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.',
			})
		}
		return {}
	}
	return (sourceCode.parserServices as ParserServices)
		.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor, options)
}
