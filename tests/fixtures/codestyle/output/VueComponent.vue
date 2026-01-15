<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
import NcComponent from './NcComponent.vue'

export default {
	name: 'MyApp', // ❌ Should be PascalCase 'MyApp'

	components: {
		NcComponent, // ❌ Should be PascalCase 'NcComponent'
	},
}
</script>

<template>
	<div>
		<NcComponent /> <!-- ❌ Should be PascalCase <NcComponent /> -->
		<NcComponent /> <!-- ❌ Should be an empty tag <NcComponent /> -->
		<NcComponent @update:modelValue="console.log" /> <!-- ❌ Should be camelCase 'update:modelValue' -->
		<NcComponent :componentProp="42" /> <!-- ❌ Should be camelCase 'componentProp' -->
		<NcComponent aria-label="Label" data-testid="test" /> <!-- ✅ Data and ARIA attributes are allowed to be in kebab-case -->
	</div>
</template>
