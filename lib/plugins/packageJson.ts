/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { JSONRuleDefinition, JSONRuleVisitor } from '@eslint/json'
import type { ESLint } from 'eslint'

import path from 'node:path'
import sortPackageJson from 'sort-package-json'
import { packageVersion } from '../version.ts'

const SortPackageJsonRule: JSONRuleDefinition = {
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

	create(context) {
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
						fix(fixer) {
							return fixer.replaceText(body, sortedPackageJsonText)
						},
					})
				}
			},
		} as JSONRuleVisitor
	},
}

/**
 * ESLint plugin to sort package.json files in a consistent way.
 */
const Plugin: ESLint.Plugin = {
	meta: {
		name: '@nextcloud/package-json',
		version: packageVersion,
	},
	rules: {
		'sort-package-json': SortPackageJsonRule,
	},
}

export default Plugin
