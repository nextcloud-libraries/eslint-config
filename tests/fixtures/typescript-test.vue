<template>
	<code>String: "{{ props.someString }}"
		Int: {{ props.someInt }}
	</code>
</template>

<script setup lang="ts">
const props = defineProps<{
	someString: string,
	someInt: number,
}>()
</script>
