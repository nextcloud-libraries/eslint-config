<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable antfu/top-level-function */

// This is a valid .vue file in JavaScript
// With required types in JSDocs
// Types are required even in TypeScript projects

/**
 * @typedef Foo
 * @property {string} bar - Bar
 */

/**
 * @param {Foo} foo - Foo
 * @param {number} n - Number
 * @return {void} Returns nothing
 */
function log1(foo, n) {}

/**
 * @param {Foo} foo - Foo
 * @param {number} n - Number
 * @return {void} Returns nothing
 */
const log2 = (foo, n) => {}

/**
 * @param {Foo} foo - Foo
 * @param {number} n - Number
 * @return {void} Returns nothing
 */
const log3 = function(foo, n) {}

const obj = {
	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 * @return {void} Returns nothing
	 */
	log4(foo, n) {},
}

class Log {
	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 * @return {void} Returns nothing
	 */
	log5(foo, n) {}

	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 * @return {void} Returns nothing
	 */
	static log6(foo, n) {}

	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 */
	constructor(foo, n) {}
}

/**
 * @return {number} Just 42
 */
function log6() {
	return 42
}

export default {
	name: 'JsdocJavascriptWithTypes',
}
</script>
