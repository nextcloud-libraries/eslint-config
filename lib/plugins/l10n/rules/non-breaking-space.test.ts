/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
/* eslint-disable @nextcloud-l10n/non-breaking-space */
import { RuleTester } from 'eslint'
import { test } from 'vitest'
import rule from './non-breaking-space.ts'

test('rule: non-breaking-space', () => {
	const ruleTester = new RuleTester()

	ruleTester.run('non-breaking-space', rule, {
		valid: [
			{
				code: "t('files', 'Loading …')",
			},
			{
				code: "const foo = 'Loading …'",
			},
			{
				code: "const foo = 'Loading…'",
			},
			{
				code: "const foo = 'Loading ...'",
			},
		],

		invalid: [
			{
				code: "t('files', 'Loading …')",
				output: "t('files', 'Loading …')",
				errors: [
					{
						type: 'Literal',
						message: 'Ellipsis must be preceded by non-breaking spaces',
					},
				],
			},
			{
				// eslint-disable-next-line @stylistic/no-tabs
				code: "const foo = 'Loading	…'",
				output: "const foo = 'Loading …'",
				errors: [
					{
						type: 'Literal',
						message: 'Ellipsis must be preceded by non-breaking spaces',
					},
				],
			},
		],
	})
})
