/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'
import noLongImports from './no-long-imports.ts'

export const rules: Record<string, Rule.RuleModule> = {
	'no-long-imports': noLongImports,
}
