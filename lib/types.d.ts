/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface ConfigOptions {
	isLibrary: boolean
	vueIsTypescript: boolean

	/**
	 * Include formatting related rules.
	 *
	 * @default true
	 */
	formatting?: boolean

	/**
	 * Include linting related rules.
	 *
	 * @default true
	 */
	linting?: boolean
}
