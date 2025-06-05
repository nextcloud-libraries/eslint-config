/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'

/**
 * General config to exclude known non-source directories from linting
 */
export const filesystem: Linter.Config[] = [
	{
		name: 'nextcloud/filesystem/ignores',
		ignores: [
			'**/dist',
			'**/js',
			'**/l10n',
			'**/vendor',
			'**/vendor-bin',
			'**/package-lock.json',
		],
	},
]
