/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'

/**
 * Restrict a set of configurations to a given glob pattern
 *
 * @param configs The configs to restrict
 * @param files The glob pattern to assign
 */
export function restrictConfigFiles(configs: Linter.Config[], files: string[]): Linter.Config[] {
	return configs.map((config) => ({
		...config,
		files: [
			...(config.files ?? []),
			...files,
		],
	}))
}
