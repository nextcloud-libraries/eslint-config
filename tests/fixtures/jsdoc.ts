/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * A number, or a string containing a number.
 *
 * @typedef {(number|string)} NumberLike
 */

/**
 * Set the magic number.
 *
 * @param {NumberLike} x - The magic number.
 * @return {boolean}
 */
export function setMagicNumber(x) {
	return typeof x === 'string'
}
