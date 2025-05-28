<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsdoc/require-returns-check */
/* eslint-disable antfu/top-level-function */

type Foo = {
	/**
	 * Bar
	 */
	bar: string
}

/**
 * @param foo - Foo
 * @param n - Number
 * @return Returns nothing
 */
function log1(foo: Foo, n: number): void {}

/**
 * @param foo - Foo
 * @param n - Number
 * @return Returns nothing
 */
const log2 = (foo: Foo, n: number): void => {}

/**
 * @param foo - Foo
 * @param n - Number
 * @return Returns nothing
 */
const log3 = function(foo: Foo, n: number): void {}

const obj = {
	/**
	 * @param foo - Foo
	 * @param n - Number
	 * @return Returns nothing
	 */
	log4(foo: Foo, n: number): void {},
}

class Log {
	/**
	 * @param foo - Foo
	 * @param n - Number
	 * @return Returns nothing
	 */
	log5(foo: Foo, n: number): void {}

	/**
	 * @param foo - Foo
	 * @param n - Number
	 * @return Returns nothing
	 */
	static log6(foo: Foo, n: number): void {}

	/**
	 * @param foo - Foo
	 * @param n - Number
	 */
	constructor(foo: Foo, n: number) {}
}

/**
 * @return Just 42
 */
function log6() {
	return 42
}

export default {
	name: 'JsdocTypescriptWithoutTypes',
}
</script>
