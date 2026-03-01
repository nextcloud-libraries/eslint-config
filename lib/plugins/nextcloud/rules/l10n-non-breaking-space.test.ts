/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { test } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './l10n-non-breaking-space.ts'

test('rule: l10n-non-breaking-space', () => {
	const ruleTester = new RuleTester()

	ruleTester.run('l10n-non-breaking-space', rule, {
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
			/* eslint-disable @nextcloud/l10n-non-breaking-space */
			{
				code: "t('files', 'Loading …')",
				output: "t('files', 'Loading …')",
				errors: [{
					messageId: 'precedeWithNonbreakingSpace',
				}],
			},
			{
				// eslint-disable-next-line @stylistic/no-tabs
				code: "const foo = 'Loading	…'",
				output: "const foo = 'Loading …'",
				errors: [{
					messageId: 'precedeWithNonbreakingSpace',
				}],
			},
			/* eslint-enable @nextcloud/l10n-non-breaking-space */
		],
	})
})

test('rule: non-breaking-space in vue templates', () => {
	const ruleTester = new RuleTester({
		languageOptions: {
			parser: vueParser,
			ecmaVersion: 2015,
		},
	})

	ruleTester.run('non-breaking-space', rule, {
		valid: [
			{
				code: "<template><div>{{ t('Loading …') }}</div></template>",
			},
			{
				code: "<template><div>{{ t('files', 'Loading …') }}</div></template>",
			},
			{
				code: "<template><div>{{ t('files', 'Loading…') }}</div></template>",
			},
			{
				code: "<template><div>{{ t('files', 'Loading ...') }}</div></template>",
			},
		],

		invalid: [
			/* eslint-disable @nextcloud/l10n-non-breaking-space */
			{
				code: "<template><div>{{ t('files', 'Loading …') }}</div></template>",
				output: "<template><div>{{ t('files', 'Loading …') }}</div></template>",
				errors: [{
					messageId: 'precedeWithNonbreakingSpace',
				}],
			},
			{
				// eslint-disable-next-line @stylistic/no-tabs
				code: "<template><div>{{ t('files', 'Loading	…') }}</div></template>",
				output: "<template><div>{{ t('files', 'Loading …') }}</div></template>",
				errors: [{
					messageId: 'precedeWithNonbreakingSpace',
				}],
			},
			/* eslint-enable @nextcloud/l10n-non-breaking-space */
		],
	})
})
