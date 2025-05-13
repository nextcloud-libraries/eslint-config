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
const foo = 'Foo ' + bar
const bar = 'Bar'
</script>
