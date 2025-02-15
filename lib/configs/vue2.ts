/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type {
	Linter,
} from 'eslint'
import vuePlugin from 'eslint-plugin-vue'
import {
	vue,
} from './vue.ts'
import { restrictConfigFiles } from '../utils.ts'
import { GLOB_FILES_VUE } from '../globs.ts'
import { ConfigOptions } from '../types'

/**
 * Vue2 related ESLint rules for Nextcloud
 *
 * @param option options defining the config preset flavor
 */
export function vue2(option: ConfigOptions): Linter.Config[] {
	return [
		...restrictConfigFiles(
			vuePlugin.configs['flat/vue2-recommended'],
			GLOB_FILES_VUE,
		),

		...vue(option),

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
