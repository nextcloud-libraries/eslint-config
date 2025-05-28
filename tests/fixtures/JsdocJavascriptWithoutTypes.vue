<!--
  - SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsdoc/require-returns-check */
/* eslint-disable antfu/top-level-function */

// This is a .vue file in JavaScript
// Missing required types in JSDocs
// Types are required even in TypeScript projects

/**
 * bar - Bar
 */

/**
 * @param foo - Foo
 * @param n - Number
 * @return Returns nothing
 */
function log1(foo, n) {}

/**
 * @param foo - Foo
 * @param n - Number
 * @return Returns nothing
 */
const log2 = (foo, n) => {}

/**
 * @param foo - Foo
 * @param n - Number
 * @return Returns nothing
 */
const log3 = function(foo, n) {}

const obj = {
	/**
	 * @param foo - Foo
	 * @param n - Number
	 * @return Returns nothing
	 */
	log4(foo, n) {},
}

class Log {
	/**
	 * @param foo - Foo
	 * @param n - Number
	 * @return Returns nothing
	 */
	log5(foo, n) {}

	/**
	 * @param foo - Foo
	 * @param n - Number
	 * @return Returns nothing
	 */
	static log6(foo, n) {}

	/**
	 * @param foo - Foo
	 * @param n - Number
	 */
	constructor(foo, n) {}
}

/**
 * @return Just 42
 */
function log6() {
	return 42
}

export default {
	name: 'JsdocJavascriptWithoutTypes',
}
</script>
