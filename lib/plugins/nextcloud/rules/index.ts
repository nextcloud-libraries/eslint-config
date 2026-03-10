/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import l10nEnforceEllipsis from './l10n-enforce-ellipsis.ts'
import l10nNonBreakingSpace from './l10n-non-breaking-space.ts'
import noDeprecatedGlobals from './no-deprecated-globals.ts'
import noDeprecatedLibraryExports from './no-deprecated-library-exports.ts'
import noDeprecatedLibraryProps from './no-deprecated-library-props.ts'
import noRemovedGlobals from './no-removed-globals.ts'

export const rules: Record<string, Rule.RuleModule> = {
	'l10n-enforce-ellipsis': l10nEnforceEllipsis,
	'l10n-non-breaking-space': l10nNonBreakingSpace,
	'no-deprecated-globals': noDeprecatedGlobals,
	'no-removed-globals': noRemovedGlobals,
	'no-deprecated-library-exports': noDeprecatedLibraryExports,
	'no-deprecated-library-props': noDeprecatedLibraryProps,
}
