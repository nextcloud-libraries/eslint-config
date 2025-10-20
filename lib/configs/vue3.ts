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
				// Deprecated thus we should not use it
				'vue/no-deprecated-delete-set': 'error',
				// When using script-setup the modern approach should be used
				'vue/prefer-define-options': 'error',
			},
			name: 'nextcloud/vue3/rules',
		},
	]
}
