/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'
import type { ConfigOptions } from '../types.d.ts'

import gitignore from 'eslint-config-flat-gitignore'

/**
 * General config to exclude known non-source directories from linting
 *
 * @param options - Configuration options
 */
export function filesystem(options: ConfigOptions): Linter.Config[] { // eslint-disable-line @typescript-eslint/no-unused-vars
	return [
		{
			...gitignore(),
			name: 'nextcloud/filesystem/gitignore',
		},
		{
			name: 'nextcloud/filesystem/ignores',
			ignores: [
				'dist/',
				'js/',
				'l10n/',
				'vendor/',
				'vendor-bin/',
				'**/package-lock.json',
			],
		},
	]
}
