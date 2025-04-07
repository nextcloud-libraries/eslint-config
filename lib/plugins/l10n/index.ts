/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint } from 'eslint'
import { __PACKAGE_VERSION__ } from '../../version.js'
import RuleEllipsis from './rules/enforce-ellipsis.js'
import RuleNonBreakingSpace from './rules/non-breaking-space.js'

/**
 * ESLint plugin to enforce consistent translations
 */
const Plugin: ESLint.Plugin = {
	meta: {
		name: '@nextcloud/l10n-plugin',
		version: __PACKAGE_VERSION__,
	},
	rules: {
		'non-breaking-space': RuleNonBreakingSpace,
		'enforce-ellipsis': RuleEllipsis,
	},
}

export default Plugin
