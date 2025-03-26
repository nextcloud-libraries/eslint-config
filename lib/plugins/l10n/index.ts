/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { ESLint } from 'eslint'
import RuleEllipsis from './rules/enforce-ellipsis.ts'
import RuleNonBreakingSpace from './rules/non-breaking-space.ts'

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
