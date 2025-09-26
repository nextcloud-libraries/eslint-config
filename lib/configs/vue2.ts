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
 * Vue2 related ESLint rules for Nextcloud
 *
 * @param options - Configuration options defining the config preset flavor
 */
export function vue2(options: ConfigOptions): Linter.Config[] {
	if (options.linting === false) {
		return []
	}

	return [
		...restrictConfigFiles(
			options.linting
				? vuePlugin.configs['flat/vue2-recommended']
				: vuePlugin.configs['flat/vue2-essential'],
			GLOB_FILES_VUE,
		),

		...vue(options),

		{
			rules: {
			// custom event naming convention
				'vue/custom-event-name-casing': [
					'error',
					'kebab-case',
					{
						// allows custom xxxx:xxx events formats
						ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'],
					},
				],
			},
			files: GLOB_FILES_VUE,
			name: 'nextcloud/vue2/rules',
		},
	]
}
