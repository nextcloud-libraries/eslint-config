<template>
	<code>String: "{{ props.someString }}"
		Int: {{ props.someInt }}
	</code>
</template>

<script setup>
const props = defineProps({
	someString: {
		type: String,
		required: true,
	},
	someInt: {
		type: Number,
		required: true,
	},
})
</script>
