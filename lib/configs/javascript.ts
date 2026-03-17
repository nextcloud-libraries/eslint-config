/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'
import type { ConfigOptions } from '../types.d.ts'

import eslintRules from '@eslint/js'
import globals from 'globals'
import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TESTING,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'
import nextcloudPlugin from '../plugins/nextcloud/index.ts'

/**
 * This config provides the base rules for code quality,
 * the target is a good code quality -> prevent bugs,
 * code style is handled by another config.
 *
 * @param options - Configuration options
 */
export function javascript(options: ConfigOptions): Linter.Config[] {
	return [
		{
			name: 'nextcloud/javascript/setup',
			languageOptions: {
				ecmaVersion: 'latest',
				globals: {
					...globals.browser,
					...globals.es2025,
					OC: 'readonly',
					OCA: 'writable',
					OCP: 'readonly',
					// injected by shared Vite and Webpack config
					appName: 'readonly',
					appVersion: 'readonly',
					// legacy global Nextcloud translation function
					t: 'readonly',
					n: 'readonly',
					// webpack support
					__webpack_nonce__: 'writable',
				},
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: 'latest',
					sourceType: 'module',
				},
				sourceType: 'module',
			},
			linterOptions: {
				reportUnusedDisableDirectives: true,
			},
		},

		// General rules we built upon
		{
			name: 'eslint/configs/recommended',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			...eslintRules.configs.recommended,
		},

		// The Nextcloud plugin for detecting deprecated and removed global API
		(
			options.isLibrary
				? {}
				: {
						name: 'nextcloud/javascript/plugin',
						plugins: {
							'@nextcloud': nextcloudPlugin,
						},
						rules: {
							'@nextcloud/no-deprecated-globals': ['warn'],
							'@nextcloud/no-removed-globals': ['error'],
						},
						files: [
							...GLOB_FILES_JAVASCRIPT,
							...GLOB_FILES_TYPESCRIPT,
							...GLOB_FILES_VUE,
						],
					}
		),

		// Nextcloud specific overwrite
		{
			name: 'nextcloud/javascript/rules',
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			rules: {
				'no-eval': 'error',
				// Require strict checks
				eqeqeq: 'error',
				// Use dot notation where possible as we also only use quote where needed
				'dot-notation': 'error',
				// prevent bugs and increasing code clarity by ensuring that block statements are wrapped in curly braces
				curly: [
					'error',
					'all',
				],
				// disallow use of "var", use let and const - see rule description for reasons.
				'no-var': 'error',
				// Prevent bugs by enforce const if variable is not changed.
				'prefer-const': 'error',
				// `@nextcloud/logger` should be used
				'no-console': 'error',
				// We support ES2022 so we should use `hasOwn` instead
				'prefer-object-has-own': 'error',
				// Allow to write code in reading order for functions
				'no-use-before-define': [
					'error',
					{ functions: false },
				],
			},
		},

		// Testing related overwrites
		{
			name: 'nextcloud/javascript/testing-overwrites',
			files: GLOB_FILES_TESTING,
			rules: {
				// Allow to test console output
				'no-console': 'off',
			},
		},
	]
}
