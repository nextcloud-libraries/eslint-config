/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { RuleTester } from 'eslint'
import { test } from 'vitest'
import rule from './enforce-ellipsis.ts'

test('rule: enforce-ellipsis', () => {
	const ruleTester = new RuleTester()

	ruleTester.run('enforce-ellipsis', rule, {
		/* eslint-disable @nextcloud-l10n/non-breaking-space */
		valid: [
			{
				code: "const foo = '..... done'",
			},
			{
				code: "const foo = 'file/..'",
			},
			{
				code: '// ...',
			},
			{
				code: 'const foo = { ...bar }',
			},
		],

		invalid: [
			{
				code: 't("Loading...")',
				output: 't("Loading…")',
				errors: [
					{
						type: 'Literal',
						message: 'Strings should ellipsis instead of triple dots',
					},
				],
			},
			{
				code: 't("files", "Loading...")',
				output: 't("files", "Loading…")',
				errors: [
					{
						type: 'Literal',
						message: 'Strings should ellipsis instead of triple dots',
					},
				],
			},
			{
				code: "t('Loading ...')",
				output: "t('Loading …')",
				errors: [
					{
						type: 'Literal',
						message: 'Strings should ellipsis instead of triple dots',
					},
				],
			},
		],
	})
})
