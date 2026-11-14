/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'
import type { Settings } from 'eslint-plugin-jsdoc/iterateJsdoc.js'
import type { ConfigOptions } from '../types.d.ts'

import { jsdoc } from 'eslint-plugin-jsdoc'
import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TESTING,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'

const TS_FUNCTION_CONTEXTS = [
	'FunctionDeclaration:has(TSTypeAnnotation)',
	'FunctionExpression:has(TSTypeAnnotation)',
	'ArrowFunctionExpression:has(TSTypeAnnotation)',
	'MethodDefinition:has(TSTypeAnnotation)',
]

const JS_FUNCTION_CONTEXTS = [
	'FunctionDeclaration:not(:has(TSTypeAnnotation))',
	'FunctionExpression:not(:has(TSTypeAnnotation))',
	'ArrowFunctionExpression:not(:has(TSTypeAnnotation))',
	'MethodDefinition:not(:has(TSTypeAnnotation))',
]

const SHARED_JSDOC_SETTINGS: Partial<Settings> = {
	// We use the alias for legacy reasons to prevent unnecessary noise
	tagNamePreference: {
		returns: 'return',
	},
}

/**
 * Config factory for code documentation related rules (JSDoc)
 *
 * @param options options defining the config preset flavor
 */
export function documentation(options: ConfigOptions): Linter.Config[] {
	return [
		{
			...jsdoc({
				config: 'flat/recommended-typescript-flavor',
				settings: {
					...SHARED_JSDOC_SETTINGS,
					mode: 'permissive',
				},
			}),
			name: 'nextcloud/documentation/javascript',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...(options.vueIsTypescript ? [] : GLOB_FILES_VUE),
			],
			ignores: GLOB_FILES_TESTING,
		},

		{
			...jsdoc({
				config: 'flat/recommended-typescript',
				settings: SHARED_JSDOC_SETTINGS,
			}),
			name: 'nextcloud/documentation/typescript',
			files: [
				...GLOB_FILES_TYPESCRIPT,
				...(options.vueIsTypescript ? GLOB_FILES_VUE : []),
			],
			ignores: GLOB_FILES_TESTING,
		},

		{
			name: 'nextcloud/documentation/rules',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			ignores: GLOB_FILES_TESTING,
			rules: {
				// Force proper documentation
				'jsdoc/check-tag-names': 'error',
				// But ignore return values
				'jsdoc/require-returns': 'off',
				'jsdoc/require-returns-description': 'off',
				// Allow one empty line in jsdoc blocks
				'jsdoc/tag-lines': [
					'warn',
					'any',
					{ startLines: 1 },
				],
			},
		},

		{
			name: 'nextcloud/documentation/rules-typescript',
			files: [...GLOB_FILES_TYPESCRIPT],
			ignores: GLOB_FILES_TESTING,
			rules: {
				// Overwrites for documentation as types are already provided by Typescript
				'jsdoc/no-types': 'error',
				'jsdoc/require-param-type': 'off',
				'jsdoc/require-returns-type': 'off',
			},
		},

		...(options.vueIsTypescript
			? [
					{
						name: 'nextcloud/documentation/rules-vue',
						files: [...(options.vueIsTypescript ? GLOB_FILES_VUE : [])],
						ignores: GLOB_FILES_TESTING,
						rules: {
							// Vue files can be both Javascript and Typescript
							// Try to apply TS files only for functions with TS definitions
							'jsdoc/no-types': [
								'error',
								{ contexts: TS_FUNCTION_CONTEXTS },
							],
							'jsdoc/require-param-type': [
								'error',
								{ contexts: JS_FUNCTION_CONTEXTS },
							],
							// Unlike params, return values are often inferred and not explicitly typed
							'jsdoc/require-returns-type': 'off',
							// Unfortunately, we cannot check when it is used in TS context and when not
							'jsdoc/check-tag-names': [
								'error',
								{ typed: false },
							],
						},
					} satisfies Linter.Config,
				]
			: []
		),
	]
}
