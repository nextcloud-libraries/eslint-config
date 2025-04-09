/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ConfigOptions } from '../types.d.ts'
import type { Linter } from 'eslint'

import jsdocPlugin from 'eslint-plugin-jsdoc'

import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TESTING,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'

/**
 * Config factory for code documentation related rules (JSDoc)
 *
 * @param options options defining the config preset flavor
 */
export function documentation(options: ConfigOptions): Linter.Config[] {
	return [
		{
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			plugins: {
				jsdoc: jsdocPlugin,
			},
		},

		{
			...jsdocPlugin.configs['flat/recommended-typescript-flavor'],
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...(options.vueIsTypescript ? [] : GLOB_FILES_VUE),
			],
			settings: {
				jsdoc: {
					mode: 'permissive',
				},
			},
			ignores: GLOB_FILES_TESTING,
		},

		{
			...jsdocPlugin.configs['flat/recommended-typescript'],
			files: [
				...GLOB_FILES_TYPESCRIPT,
				...(options.vueIsTypescript ? GLOB_FILES_VUE : []),
			],
			ignores: GLOB_FILES_TESTING,
		},

		{
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
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			settings: {
				jsdoc: {
					// We use the alias for legacy reasons to prevent unnecessary noise
					tagNamePreference: {
						returns: 'return',
					},
				},
			},
			name: 'nextcloud/documentation/rules',
		},

		{
			rules: {
				// Overwrites for documentation as types are already provided by Typescript
				'jsdoc/require-param-type': 'off',
				'jsdoc/require-property-type': 'off',
				'jsdoc/require-returns-type': 'off',
			},
			files: [
				...GLOB_FILES_TYPESCRIPT,
				...(options.vueIsTypescript ? GLOB_FILES_VUE : []),
			],
			name: 'nextcloud/documentation/rules-typescript',
		},
	]
}
