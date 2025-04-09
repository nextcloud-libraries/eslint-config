/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/** Glob pattern for test files (specs) */
export const GLOB_FILES_TESTING = [
	'**/*.test.*',
	'**/*.spec.*',
	'**/*.cy.*',
	'**/test',
	'**/tests',
]

/** Glob pattern for Typescript files */
export const GLOB_FILES_TYPESCRIPT = [
	'**/*.ts',
	'**/*.mts',
	'**/*.cts',
	'**/*.tsx',
]

/** Glob pattern for Javascript files */
export const GLOB_FILES_JAVASCRIPT = [
	'**/*.js',
	'**/*.cjs',
	'**/*.mjs',
	'**/*.jsx',
]

/** Glob pattern for JSON files */
export const GLOB_FILES_JSON = ['**/*.json']

/** Glob pattern for JSONC files */
export const GLOB_FILES_JSONC = ['**/*.jsonc']

/** Glob pattern for Microsoft JSON files which use a slightly different JSONC implementation */
export const GLOB_FILES_MS_JSON = [
	'**/tsconfig.json',
	'.vscode/*.json',
]

/** Glob pattern for Vue.JS files */
export const GLOB_FILES_VUE = ['**/*.vue']
