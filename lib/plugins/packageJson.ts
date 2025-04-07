/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint, Rule } from 'eslint'
import { __PACKAGE_VERSION__ } from '../version.js'

import path from 'node:path'
import sortPackageJson from 'sort-package-json'

const SortPackageJsonRule: Rule.RuleModule = {
	meta: {
		fixable: 'code',
		docs: {
			recommended: true,
			description: 'Sort package json in consistent order',
		},
		schema: [
			{
				type: 'object',
				properties: {
					sortOrder: {
						type: 'array',
						minItems: 0,
						items: {
							type: 'string',
						},
					},
				},
				additionalProperties: false,
			},
		],
	},

	create(context: Rule.RuleContext): Rule.RuleListener {
		if (path.basename(context.filename) !== 'package.json') {
			return {}
		}

		const options = context.options ? context.options[0] : undefined

		return {
			Document({ body }) {
				const sourceCode = context.sourceCode.text
				const packageJsonText = sourceCode.slice(...body.range)
				const sortedPackageJsonText = sortPackageJson(packageJsonText, options as never)

				if (packageJsonText !== sortedPackageJsonText) {
					context.report({
						node: body,
						message: 'package.json is not sorted correctly',
						fix(fixer: Rule.RuleFixer): Rule.Fix {
							return fixer.replaceText(body, sortedPackageJsonText)
						},
					})
				}
			},
		} satisfies Rule.NodeListener
	},
}

/**
 * ESLint plugin to sort package.json files in a consistent way.
 */
const Plugin: ESLint.Plugin = {
	meta: {
		name: '@nextcloud/package-json',
		version: __PACKAGE_VERSION__,
	},
	rules: {
		'sort-package-json': SortPackageJsonRule,
	},
}

export default Plugin
