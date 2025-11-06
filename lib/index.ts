/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'
import type { ConfigOptions } from './types.d.ts'

import { codeStyle } from './configs/codeStyle.ts'
import { documentation } from './configs/documentation.ts'
import { filesystem } from './configs/filesystem.ts'
import { imports } from './configs/imports.ts'
import { javascript } from './configs/javascript.ts'
import { json } from './configs/json.ts'
import { node } from './configs/node.ts'
import { typescript } from './configs/typescript.ts'
import { vue2 } from './configs/vue2.ts'
import { vue3 } from './configs/vue3.ts'

/**
 * Nextcloud shared configuration for projects using Vue 2 with Javascript <script> blocks
 */
export const recommendedVue2Javascript: Linter.Config[] = createConfig({
	isLibrary: false,
	vue2: true,
	vueIsTypescript: false,
})

/**
 * Nextcloud shared configuration for projects using Vue 2 with Typescript <script> blocks
 */
export const recommendedVue2: Linter.Config[] = createConfig({
	isLibrary: false,
	vue2: true,
	vueIsTypescript: true,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Javascript <script> blocks
 */
export const recommendedJavascript: Linter.Config[] = createConfig({
	isLibrary: false,
	vueIsTypescript: false,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommended: Linter.Config[] = createConfig({
	isLibrary: false,
	vueIsTypescript: true,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommendedLibrary: Linter.Config[] = createConfig({
	isLibrary: true,
	vueIsTypescript: true,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommendedVue2Library: Linter.Config[] = createConfig({
	isLibrary: true,
	vue2: true,
	vueIsTypescript: true,
})

export { default as packageJsonPlugin } from './plugins/packageJson.ts'
export { default as nextcloudPlugin } from './plugins/nextcloud/index.ts'
export { default as l10nPlugin } from './plugins/l10n/index.ts'

/**
 * Generate a configuration based on given options
 *
 * @param options - Configuration options
 */
function createConfig(options: ConfigOptions & { vue2?: boolean }): Linter.Config[] {
	return [
		...filesystem,
		...javascript(options),
		...json,
		...node,
		...typescript(options),
		...(
			options.vue2
				? vue2(options)
				: vue3(options)
		),
		...documentation(options),
		...imports(options),
		...codeStyle(options),
	]
}
