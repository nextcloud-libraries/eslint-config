/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

// This is invalid because a is an arrow function and will not be defined before execution
export const b = `${a()}...`
const a = () => 'a'

// This is valid to use a function before define due to the function keyword it is defined before execution
export const d = c()

/**
 * Random function
 */
function c() {
	return 'c'
}
