/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { ESLint } from 'eslint'
import { rules } from './rules/index.js'
import { __PACKAGE_VERSION__ } from '../../version.js'

export default {
	rules,
	meta: {
		name: '@nextcloud/eslint-plugin',
		version: __PACKAGE_VERSION__,
	},
} as ESLint.Plugin
