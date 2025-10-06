/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'
import type { ConfigOptions } from '../types.d.ts'

import perfectionist from 'eslint-plugin-perfectionist'
import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'
import importExtensions from '../plugins/import-extensions/index.ts'

/**
 * Generate imports and exports related ESLint rules.
 *
 * @param options - Configuration options
 */
export function imports(options: ConfigOptions): Linter.Config[] {
	const lintingRules: Partial<Linter.RulesRecord> = {
		// Require file extensions
		'import-extensions/extensions': 'error',
	}

	const formattingRules: Partial<Linter.RulesRecord> = {
		// Sorting of imports
		'sort-imports': 'off' as const,
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
					// Vue components
					'vue', // external modules (e.g. nextcloud-vue)
					'internalVue', // internal local vue components
					// everything else which is everything internal
					'unknown',
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
	}

	return [
		{
			name: 'nextcloud/imports/setup',
			plugins: {
				...(options.formatting ? { perfectionist } : {}),
				...(options.linting ? { 'import-extensions': importExtensions } : {}),
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
				...(options.linting ? lintingRules : {}),
				...(options.formatting ? formattingRules : {}),
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
