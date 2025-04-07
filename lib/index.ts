/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { codeStyle } from './configs/codeStyle.js'
import { documentation } from './configs/documentation.js'
import { filesystem } from './configs/filesystem.js'
import { javascript } from './configs/javascript.js'
import { json } from './configs/json.js'
import { node } from './configs/node.js'
import { typescript } from './configs/typescript.js'
import { vue2 } from './configs/vue2.js'
import { vue3 } from './configs/vue3.js'
import { ConfigOptions } from './types.js'

/**
 * Nextcloud shared configuration for projects using Vue 2 with Javascript <script> blocks
 */
export const recommendedVue2Javascript = createConfig({
	isLibrary: false,
	vue2: true,
	vueIsTypescript: false,
})

/**
 * Nextcloud shared configuration for projects using Vue 2 with Typescript <script> blocks
 */
export const recommendedVue2 = createConfig({
	isLibrary: false,
	vue2: true,
	vueIsTypescript: true,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Javascript <script> blocks
 */
export const recommendedJavascript = createConfig({
	isLibrary: false,
	vueIsTypescript: false,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommended = createConfig({
	isLibrary: false,
	vueIsTypescript: true,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommendedLibrary = createConfig({
	isLibrary: true,
	vueIsTypescript: true,
})

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommendedVue2Library = createConfig({
	isLibrary: true,
	vue2: true,
	vueIsTypescript: true,
})

export { default as packageJsonPlugin } from './plugins/packageJson.js'
export { default as nextcloudPlugin } from './plugins/nextcloud/index.js'
export { default as l10nPlugin } from './plugins/l10n/index.js'

/**
 * Generate a configuration based on given options
 *
 * @param options - Configuration options
 */
function createConfig(options: ConfigOptions & { vue2?: boolean }) {
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
		...codeStyle(options),
	]
}
