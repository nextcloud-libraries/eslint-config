/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint } from 'eslint'

import { packageVersion } from '../../version.ts'
import { rules } from './rules/index.ts'

export default {
	rules,
	meta: {
		name: '@nextcloud/eslint-plugin',
		version: packageVersion,
	},
} as ESLint.Plugin
