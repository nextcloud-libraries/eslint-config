/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ConfigOptions } from '../types.d.ts'

import { codeStyle } from './codeStyle.ts'
import { documentation } from './documentation.ts'
import { filesystem } from './filesystem.ts'
import { imports } from './imports.ts'
import { javascript } from './javascript.ts'
import { json } from './json.ts'
import { node } from './node.ts'
import { typescript } from './typescript.ts'
import { vue2 } from './vue2.ts'
import { vue3 } from './vue3.ts'

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

/**
 * Generate a configuration based on given options
 *
 * @param options - Configuration options
 */
export function createConfig(options: ConfigOptions & { vue2?: boolean }) {
	options = { formatting: true, linting: true, vue2: false, ...options }

	return [
		...filesystem(options),
		...javascript(options),
		...json(options),
		...node(options),
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
