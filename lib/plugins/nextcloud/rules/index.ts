/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'
import noDeprecations from './no-deprecations.js'
import noRemovedApis from './no-removed-apis.js'

export const rules: Record<string, Rule.RuleModule> = {
	'no-deprecations': noDeprecations,
	'no-removed-apis': noRemovedApis,
}
