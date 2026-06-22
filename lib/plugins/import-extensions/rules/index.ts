/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { rule as banInlineTypeImports } from './ban-inline-type-imports.ts'
import { rule as extensions } from './extensions.ts'

export const rules = {
	'ban-inline-type-imports': banInlineTypeImports,
	extensions,
}
