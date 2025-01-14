/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'
import eslintRules from '@eslint/js'
import { GLOB_FILES_JAVASCRIPT, GLOB_FILES_TESTING, GLOB_FILES_TYPESCRIPT, GLOB_FILES_VUE } from '../globs'
import globals from 'globals'
// import nextcloudPlugin from '@nextcloud/eslint-plugin'

/**
 * This config provides the base rules for code quality,
 * the target is a good code quality -> prevent bugs,
 * code style is handled by another config.
 */
export const javascript: Linter.Config[] = [
	{
		name: 'nextcloud/javascript/setup',
		languageOptions: {
			ecmaVersion: 'latest',
			globals: {
				...globals.browser,
				...globals.es2025,
				OC: 'writable',
				OCA: 'readonly',
				OCP: 'readonly',
				// legacy global Nextcloud translation function
				t: 'readonly',
				n: 'readonly',
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

	// nextcloudPlugin.configs.recommended,

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
