/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { ESLint } from 'eslint'
import { rules } from './rules/index.ts'
import { __PACKAGE_VERSION__ } from '../../version.ts'

export default {
	rules,
	meta: {
		name: '@nextcloud/eslint-plugin',
		version: __PACKAGE_VERSION__,
	},
} as ESLint.Plugin
