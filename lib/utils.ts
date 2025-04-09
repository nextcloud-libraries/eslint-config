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
export function restrictConfigFiles(configs: Linter.Config[], files: string[]) {
	return configs.map((config) => ({
		...config,
		files: [
			...(config.files ?? []),
			...files,
		],
	}))
}

/**
 * Make all rules error severity.
 *
 * @param rules - Rules record to adjust
 */
export function makeErrorLevel(rules: Linter.RulesRecord) {
	const config = structuredClone(rules)
	for (const key of Object.keys(config)) {
		if (Array.isArray(config[key])) {
			config[key][0] = 'error'
		} else {
			config[key] = 'error'
		}
	}
	return config
}
