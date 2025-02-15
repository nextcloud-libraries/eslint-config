<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<div>
		{{ foo }}
	</div>
</template>

<script lang="ts" setup>
/**
 * This will result in no error on JS but one in TS as type is duplicated
 *
 * @type {string}
 */
const foo: string = 'Foo bar'
</script>
