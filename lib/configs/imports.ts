import type { Linter } from 'eslint'
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ConfigOptions } from '../types.d.ts'

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
						newlinesBetween: 'never',
						groups: [
							// type first
							'external-type',
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
							// Vue components
							'vue', // external modules (e.g. nextcloud-vue)
							'internalVue', // internal local vue components
							{ newlinesBetween: 'always' },
							// side effect only: import 'sideeffect.js'
							'side-effect',
							// import style from 'my.module.css'
							'style',
						],
						customGroups: [
							{
								groupName: 'vue',
								selector: 'external',
								modifiers: ['value'],
								elementNamePattern: [
									'\\.vue$',
									'@nextcloud/vue/components/',
								],
							},
							{
								groupName: 'internalVue',
								modifiers: ['value'],
								elementNamePattern: ['\\.vue$'],
							},
						],
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
function createSortingConfig(type: 'export' | 'import') {
	return {
		type: 'natural',
		newlinesBetween: 'always',
		partitionByNewLine: false,
		groups: [
			`type-${type}`,
			[
				`value-${type}`,
				'unknown',
			],
		],
	}
}
