/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint } from 'eslint'

import { packageVersion } from '../../version.ts'
import { rules } from './rules/index.ts'

/**
 * ESLint plugin to enforce consistent translations
 */
const Plugin: ESLint.Plugin = {
	meta: {
		name: '@nextcloud/l10n-plugin',
		version: packageVersion,
	},
	rules,
}

export default Plugin
