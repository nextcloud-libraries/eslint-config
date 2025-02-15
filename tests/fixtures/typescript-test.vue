<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<code>String: "{{ props.someString }}"
		Int: {{ props.someInt }}
	</code>
</template>

<script setup lang="ts">
const props = defineProps<{
	/** A string */
	someString: string
	/** A number */
	someInt: number
}>()
</script>
