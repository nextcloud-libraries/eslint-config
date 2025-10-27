/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* eslint-disable @nextcloud-l10n/non-breaking-space */

import { RuleTester } from 'eslint'
import { test } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './non-breaking-space-vue.ts'

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
		],
	})
})
