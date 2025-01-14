/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint, Linter } from 'eslint'
import jsonPlugin from '@eslint/json'
import packageJsonPlugin from '../plugins/packageJson.ts'
import { GLOB_FILES_JSON } from '../globs.ts'

/**
 * JSON related ESLint rules for Nextcloud
 */
export const json: Linter.Config[] = [
	{
		language: 'json/json',
		plugins: {
			json: jsonPlugin as ESLint.Plugin,
			'package-json': packageJsonPlugin,
		},
		rules: {
			'json/no-duplicate-keys': 'error',
			'json/no-empty-keys': 'error',
		},
		files: GLOB_FILES_JSON,
		name: 'nextcloud/json',
	},

	// lint package.json files
	{
		files: ['**/package.json'],
		language: 'json/json',
		rules: {
			'package-json/sort-package-json': 'error',
		},
	},
]
