<!--
  - SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
<template>
	<code>String: "{{ props.someString }}"
		Int: {{ props.someInt }}
	</code>
</template>

<script setup>
const props = defineProps({
	/**
	 * Some prop
	 */
	someString: {
		type: String,
		required: true,
	},

	/**
	 * Some other prop
	 */
	someInt: {
		type: Number,
		required: true,
	},
})
</script>
