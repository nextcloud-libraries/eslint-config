<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script setup lang="ts">
import type { Slot } from 'vue'

defineProps<{
	// eslint-disable-next-line vue/no-unused-properties
	'component-prop': number // ❌ Should be camelCase 'componentProp'
}>()

// Note: vue/custom-event-name-casing only checks emit/$emit calls, not event definitions
const emit = defineEmits<{
	'my-event': []
	'namespace:event': []
	'update:model-value': [value: unknown]
}>()

// Note: vue/slot-name-casing only checks name in <slot name> in template, not slot definitions
defineSlots<{
	'my-icon': Slot
}>()

emit('update:model-value', 'value') // ❌ Should be camelCase 'update:modelValue'
</script>

<template>
	<div>
		<button @click="$emit('my-event')" /> <!-- ❌ Should be camelCase 'myEvent' -->
		<button @click="$emit('namespace:event')" /> <!-- ✅ Namespaced events are allowed -->
		<button @click="$emit('update:model-value')" /> <!-- ⚠️ vue/custom-event-name-casing ignores update:* events completely -->
		<slot name="my-icon" /> <!-- ❌ Should be camelCase 'myIcon' -->
	</div>
</template>
