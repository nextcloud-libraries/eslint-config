/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { codeStyle } from './configs/codeStyle'
import { documentation } from './configs/documentation.ts'
import { filesystem } from './configs/filesystem.ts'
import { javascript } from './configs/javascript'
import { json } from './configs/json.ts'
import { node } from './configs/node.ts'
import { typescript } from './configs/typescript.ts'
import { vue2 } from './configs/vue2'
import { vue3 } from './configs/vue3.ts'

/**
 * Nextcloud shared configuration for projects using Vue 2 with Javascript <script> blocks
 */
export const recommendedVue2Javascript = [
	...filesystem,
	...javascript,
	...json,
	...node,
	...typescript({ vueIsTypescript: false }),
	...vue2({ vueIsTypescript: false }),
	...documentation({ vueIsTypescript: false }),
	...codeStyle({ vueIsTypescript: false }),
]

/**
 * Nextcloud shared configuration for projects using Vue 2 with Typescript <script> blocks
 */
export const recommendedVue2 = [
	...filesystem,
	...javascript,
	...json,
	...node,
	...typescript({ vueIsTypescript: true }),
	...vue2({ vueIsTypescript: true }),
	...documentation({ vueIsTypescript: true }),
	...codeStyle({ vueIsTypescript: true }),
]

/**
 * Nextcloud shared configuration for projects using Vue 3 with Javascript <script> blocks
 */
export const recommendedJavascript = [
	...filesystem,
	...javascript,
	...json,
	...node,
	...typescript({ vueIsTypescript: false }),
	...vue3({ vueIsTypescript: false }),
	...documentation({ vueIsTypescript: false }),
	...codeStyle({ vueIsTypescript: false }),
]

/**
 * Nextcloud shared configuration for projects using Vue 3 with Typescript <script> blocks
 */
export const recommended = [
	...filesystem,
	...javascript,
	...json,
	...node,
	...typescript({ vueIsTypescript: true }),
	...vue3({ vueIsTypescript: true }),
	...documentation({ vueIsTypescript: true }),
	...codeStyle({ vueIsTypescript: true }),
]
