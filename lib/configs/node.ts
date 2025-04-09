/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import globals from 'globals'

import { GLOB_FILES_TESTING } from '../globs.ts'

/**
 * Config setup for the node environment.
 * Config files should be parsed as Node.JS scripts with Node globals etc.
 */
export const node: Linter.Config[] = [
	{
		name: 'nextcloud/node/setup',
		files: [
			'**/*.config.*',
			'**/*.cjs',
			'**/*.cts',
			...GLOB_FILES_TESTING,
		],
		languageOptions: {
			globals: {
				...globals.es2023,
				...globals.node,
				...globals.nodeBuiltin,
			},
		},
	},
]
