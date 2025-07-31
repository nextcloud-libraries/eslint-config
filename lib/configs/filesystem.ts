/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'

import gitignore from 'eslint-config-flat-gitignore'

/**
 * General config to exclude known non-source directories from linting
 */
export const filesystem: Linter.Config[] = [
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
