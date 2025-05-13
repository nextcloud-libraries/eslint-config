<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */

type Foo = {
	/**
	 * Bar
	 */
	bar: string
}

/**
 * @param {Foo} foo - Foo
 * @param {number} n - Number
 * @return {void} Returns nothing
 */
function log1(foo: Foo, n: number): void {}

/**
 * @param {Foo} foo - Foo
 * @param {number} n - Number
 * @return {void} Returns nothing
 */
const log2 = (foo: Foo, n: number): void => {}

/**
 * @param {Foo} foo - Foo
 * @param {number} n - Number
 * @return {void} Returns nothing
 */
const log3 = function(foo: Foo, n: number): void {}

const obj = {
	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 * @return {void} Returns nothing
	 */
	log4(foo: Foo, n: number): void {},
}

class Log {
	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 * @return {void} Returns nothing
	 */
	log5(foo: Foo, n: number): void {}

	/**
	 * @param {Foo} foo - Foo
	 * @param {number} n - Number
	 * @return {void} Returns nothing
	 */
	static log6(foo: Foo, n: number): void {}
}

/**
 * @return {number} Just 42
 */
function log6() {
	return 42
}

export default {
	name: 'JsdocTypescriptWithTypes',
}
</script>
