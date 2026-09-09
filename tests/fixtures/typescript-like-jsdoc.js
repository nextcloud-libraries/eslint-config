/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Some example with Typescript like JSDoc
 *
 * @param {number} a - First parameter
 * @param {Record<string, number>} b - Second parameter
 * @return {{ d: number }} - The result
 */
export function foo(a, b) {
	return {
		d: a + b.c,
	}
}
