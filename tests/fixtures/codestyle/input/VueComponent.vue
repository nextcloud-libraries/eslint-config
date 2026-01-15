<!--
  - SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<script lang="ts">
import NcComponent from './NcComponent.vue'

export default {
	name: 'my-app', // ❌ Should be PascalCase 'MyApp'

	components: {
		'nc-component': NcComponent, // ❌ Should be PascalCase 'NcComponent'
	},
}
</script>

<template>
	<div>
		<nc-component /> <!-- ❌ Should be PascalCase <NcComponent /> -->
		<NcComponent></NcComponent> <!-- ❌ Should be an empty tag <NcComponent /> -->
		<NcComponent @update:model-value="console.log" /> <!-- ❌ Should be camelCase 'update:modelValue' -->
		<NcComponent :component-prop="42" /> <!-- ❌ Should be camelCase 'componentProp' -->
		<NcComponent aria-label="Label" data-testid="test" /> <!-- ✅ Data and ARIA attributes are allowed to be in kebab-case -->
	</div>
</template>
