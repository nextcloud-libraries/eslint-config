/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'
import type { ConfigOptions } from '../types.d.ts'

import vuePlugin from 'eslint-plugin-vue'
import { GLOB_FILES_VUE } from '../globs.ts'
import { restrictConfigFiles } from '../utils.ts'
import { vue } from './vue.ts'

/**
 * Vue3 related ESLint rules for Nextcloud
 *
 * @param options options defining the config preset flavor
 */
export function vue3(options: ConfigOptions): Linter.Config[] {
	return [
		...restrictConfigFiles(
			vuePlugin.configs['flat/recommended'],
			GLOB_FILES_VUE,
		),

		...vue(options),

		// Vue3 specific overrides
		{
			files: GLOB_FILES_VUE,
			rules: {
				// Force camelCase in props/attrs for consistency with <script> and prevent tooling issues
				'vue/attribute-hyphenation': ['error', 'never'],
				// Force camelCase for custom event name definitions (recommended by Vue 3 documentation and consistent with JS)
				'vue/custom-event-name-casing': [
					'error',
					'camelCase',
					{
						// Allow namespace formats namespace:event
						ignores: ['/^[a-z]+:[a-z]+$/iu'],
					},
				],
				// Force camelCase for events in template for consistency with <script>
				'vue/v-on-event-hyphenation': ['error', 'never', { autofix: true }],
				// Force camelCase for slot names.
				// Changing case is breaking for component users.
				// For libraries it may result in a breaking change. Warn to prevent unintended breaking change.
				// TODO: allow namespace:slotName format like in events
				'vue/slot-name-casing': [options.isLibrary ? 'warn' : 'error', 'camelCase'],

				// Deprecated thus we should not use it
				'vue/no-deprecated-delete-set': 'error',
				// When using script-setup the modern approach should be used
				'vue/prefer-define-options': 'error',
			},
			name: 'nextcloud/vue3/rules',
		},
	]
}
