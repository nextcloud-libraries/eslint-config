/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint, Linter } from 'eslint'
import jsonPlugin from '@eslint/json'
import packageJsonPlugin from '../plugins/packageJson.ts'
import { GLOB_FILES_JSON, GLOB_FILES_JSONC, GLOB_FILES_MS_JSON } from '../globs.ts'

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
			...jsonPlugin.configs.recommended.rules,
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

	// Special handing of JSONC
	{
		files: GLOB_FILES_JSONC,
		language: 'json/jsonc',
		...jsonPlugin.configs.recommended,
		name: 'nextcloud/jsonc',
	},

	// Microsoft specific JSONC (e.g. Typescript config)
	{
		files: GLOB_FILES_MS_JSON,
		language: 'json/jsonc',
		languageOptions: {
			// @ts-expect-error Currently this type is not overwritten by the @eslint/json package
			allowTrailingCommas: true,
		},
		...jsonPlugin.configs.recommended,
		name: 'nextcloud/ms-json',
	},
]
