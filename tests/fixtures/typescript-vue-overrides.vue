<template>
	<div>{{ foo.bar }} - {{ foo.foo }}</div>
</template>

<script lang="ts" setup>
// This should not result in `n/no-missing-import`
import type { FooBar } from './test-types'

const foo: FooBar = {
	bar: 1,
	foo: 'one',
}
</script>
