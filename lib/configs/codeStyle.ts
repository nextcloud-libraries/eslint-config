/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'
import type { ConfigOptions } from '../types.d.ts'

import stylistic from '@stylistic/eslint-plugin'
import eslintAntfuPlugin from 'eslint-plugin-antfu'
import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'
import l10nPlugin from '../plugins/l10n/index.ts'

/**
 * Config factory for general code style related rules
 * See also: https://docs.nextcloud.com/server/latest/developer_manual/getting_started/coding_standards/javascript.html#code-style
 *
 * @param options options defining the config preset flavor
 */
export function codeStyle(options: ConfigOptions): (Linter.Config | Linter.BaseConfig)[] {
	return [
		// Nextcloud code style
		{
			name: '@stylistic/configs/recommended',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			...stylistic.configs.customize({
				indent: 'tab',
				semi: false,
				quotes: 'single',
				quoteProps: 'as-needed',
				commaDangle: 'always-multiline',
				arrowParens: true,
				braceStyle: '1tbs',
			}),
		},

		{
			name: 'nextcloud/stylistic/rules',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			plugins: {
				antfu: eslintAntfuPlugin,
			},
			rules: {
				// Overrides for the stylistic recommended rules

				// Tabs should only be used for indention
				'@stylistic/no-tabs': [
					'error',
					{ allowIndentationTabs: true },
				],
				// allow spaces after tabs for alignment
				'@stylistic/no-mixed-spaces-and-tabs': [
					'error',
					'smart-tabs',
				],
				// allow backticks for strings that contain single quotes
				'@stylistic/quotes': [
					'error',
					'single',
					{
						allowTemplateLiterals: false,
						avoidEscape: true,
					},
				],

				// Not included in stylistic preset but set by us:

				// Enforce camelCase but allow legacy webpack variables
				camelcase: [
					'error',
					{
						allow: ['^__webpack_'],
						properties: 'never',
						ignoreGlobals: true,
					},
				],

				// Make sure to use object shorthand properties
				'object-shorthand': [
					'error',
					'properties',
					{ avoidQuotes: true },
				],

				// Enforce new lines after [ and before ] if there are multiline entries or more than 1 item in the array (better git diff)
				'@stylistic/array-bracket-newline': [
					'error',
					{
						multiline: true,
						minItems: null, // disable
					},
				],
				// Enforce new lines between array elements (better git diff) but allow to have single line arrays
				'@stylistic/array-element-newline': ['error', 'consistent'],
				// Same for objects as for arrays
				'@stylistic/object-curly-newline': [
					'error',
					{
						consistent: true,
						multiline: true,
					},
				],
				'@stylistic/object-property-newline': [
					'error',
					{ allowAllPropertiesOnSameLine: true },
				],

				// No space between function name and parenthesis. Enforce fn() instead of fn ()
				'@stylistic/function-call-spacing': [
					'error',
					'never',
				],
				// No space between function name and parenthesis on definition. Enforce `function foo()` instead of `function foo ()`.
				'@stylistic/space-before-function-paren': [
					'error',
					{
						// good: `function() {}` bad: `function () {}`
						anonymous: 'never',
						// good `function foo() {}` bad: `function foo () {}`
						named: 'never',
						// consistency for arrow functions regardless of async or sync:
						// good `async () => {}` bad `async() => {}`
						asyncArrow: 'always',
					},
				],
				// Enforce consistent newlines in function parameters, if one parameter is separated by newline, than all should
				'@stylistic/function-call-argument-newline': [
					'error',
					'consistent',
				],
				// If parameters are separated by newlines, then the first one should also be separated by a newline from the parenthesis
				'@stylistic/function-paren-newline': [
					'error',
					'multiline',
				],
				// Generator functions should have the * on the function keyword as this defines the type of function. "function* generator()"
				'@stylistic/generator-star-spacing': [
					'error',
					'after',
				],
				// Arrow functions with implicit return should not have line breaks
				// TODO: Discuss
				'@stylistic/implicit-arrow-linebreak': [
					'error',
					'beside',
				],
				// Prevent issues with different OS by enforcing single line feed for new lien
				'@stylistic/linebreak-style': [
					'error',
					'unix',
				],
				// No useless semicolons
				'@stylistic/no-extra-semi': ['error'],
				'no-useless-concat': 'error',
				// Prefer { ...foo } over Object.assign({}, foo)
				'prefer-object-spread': 'warn',

				// Enforce function declarations for top level functions
				'antfu/top-level-function': 'error',
			},
		},

		{
			name: 'nextcloud/stylistic/ts-rules',
			files: [
				...GLOB_FILES_TYPESCRIPT,
				...(options.vueIsTypescript ? GLOB_FILES_VUE : []),
			],
			rules: {
				// consistent spacing for types
				'@stylistic/type-annotation-spacing': 'error',
				// consistent spacing for generics
				'@stylistic/type-generic-spacing': 'error',
				'@stylistic/type-named-tuple-spacing': 'error',
			},
		},

		{
			name: 'nextcloud/stylistic/l10n',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			plugins: {
				'@nextcloud-l10n': l10nPlugin,
			},
			// Enforce that translations use ellipsis instead of tripple dots
			rules: {
				'@nextcloud-l10n/non-breaking-space': 'error',
				'@nextcloud-l10n/enforce-ellipsis': 'error',
			},
		},
	]
}
