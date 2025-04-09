/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import importPlugin from 'eslint-plugin-import'

import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'
import { makeErrorLevel } from '../utils.ts'

/**
 * ES import related ESLint rules for Nextcloud.
 * Verify imports are valid in done in a consistent way across Nextcloud apps and libraries.
 */
export const imports: Linter.Config[] = [
	{
		...importPlugin.flatConfigs.recommended,
		// By default we only enable the critical error like rules
		rules: {
			...importPlugin.flatConfigs.errors.rules,
			...makeErrorLevel(importPlugin.flatConfigs.warnings.rules),
		},
	},

	// Additional import related rules not included in errors-preset
	{
		name: 'nextcloud/imports/rules',
		files: [
			...GLOB_FILES_JAVASCRIPT,
			...GLOB_FILES_TYPESCRIPT,
			...GLOB_FILES_VUE,
		],
		settings: {
			'import/resolver': {
				typescript: true,
				node: true,
			},
		},
		rules: {
			// TODO: Move to 'error' when established
			// Do not allow to use deprecated API
			'import/no-deprecated': 'warn',
			// Do not allow "import {} from ..."
			'import/no-empty-named-blocks': 'error',
			// Do not allow e.g. './../this-folder/something.js' but directly use './something.js'
			'import/no-useless-path-segments': 'error',
			// Already included in error rules, but we need to allow raw imports
			'import/no-unresolved': [
				'error',
				{
					// Ignore Vite/Webpack query parameters, not supported by eslint-plugin-import
					// https://github.com/import-js/eslint-plugin-import/issues/2562
					ignore: [
						'\\?raw$',
						'\\?url$',
					],
				},
			],
		},
	},

	// Stylistic rules for imports
	{
		name: 'nextcloud/imports/stylistic-rules',
		files: [
			...GLOB_FILES_JAVASCRIPT,
			...GLOB_FILES_TYPESCRIPT,
			...GLOB_FILES_VUE,
		],
		rules: {
			// Prefer "import type { Foo } from ..." over "import { type Foo } from ..."
			'import/consistent-type-specifier-style': [
				'error',
				'prefer-top-level',
			],
			// Always enforce imports with extensions (ES compatibility!) except when importing packages
			'import/extensions': [
				'error',
				'ignorePackages',
			],
			// Imports should be the first thing in files (tests still work with e.g. `vi.hoisted`)
			'import/first': 'error',
			// Require a newline after each import (so not multiple `import` statements on the same line)
			'import/newline-after-import': 'error',
		},
	},
]
