/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ConfigOptions } from '../types.d.ts'
import type { Linter } from 'eslint'

import perfectionist from 'eslint-plugin-perfectionist'

import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'

/**
 * Generate imports and exports related ESLint rules.
 *
 * @param options - Configuration options
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function imports(options: ConfigOptions): Linter.Config[] {
	return [
		{
			name: 'nextcloud/imports/setup',
			plugins: {
				perfectionist,
			},
		},
		{
			name: 'nextcloud/imports/rules',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			rules: {
				// Require file extensions
				'no-restricted-imports': [
					'error',
					{
						patterns: [
							{
								regex: '^(\\.*)/(.+/)*[^/.]+$',
								message: 'Import is missing the file extension.',
							},
						],
					},
				],
				// Sorting of imports
				'sort-imports': 'off',
				'perfectionist/sort-imports': [
					'error',
					{
						type: 'natural',
						newlinesBetween: 'ignore',
						groups: [
							// type first
							'type',
							{ newlinesBetween: 'always' },
							// external things
							[
								'builtin',
								'external',
								'object',
							],
							// everything else which is everything internal
							'unknown',
							// import style from 'my.module.css'
							'style',
							// Vue components
							'vue',
							// side effect only: import 'sideeffect.js'
							'side-effect',
						],
						customGroups: {
							value: {
								vue: '\\.vue$',
							},
						},
					},
				],
				'perfectionist/sort-named-exports': [
					'error',
					createSortingConfig('export'),
				],
				'perfectionist/sort-named-imports': [
					'error',
					createSortingConfig('import'),
				],
			},
		},
	]
}

/**
 * Create the same rule config for exports and import.
 *
 * @param type The type for which to create the config
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createSortingConfig(type: 'export' | 'import') {
	return {
		type: 'natural',
		groupKind: 'types-first',

		/* eslint-disable @stylistic/no-tabs */
		// TODO: use when 4.12.0+ is released
		// newlinesBetween: 'always',
		// partitionByNewLine: false,
		// groups: [
		// 	`type-${type}`,
		// 	[`value-${type}`, 'unknown'],
		// ],
	}
}
