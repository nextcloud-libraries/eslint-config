/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { test } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './enforce-ellipsis-vue.ts'

test('rule: enforce-ellipsis in vue templates', () => {
	const ruleTester = new RuleTester({
		languageOptions: {
			parser: vueParser,
			ecmaVersion: 2015,
		},
	})

	ruleTester.run('enforce-ellipsis', rule, {

		valid: [
			{
				code: '<template><div>{{ t("Loading…") }}</div></template>',
			},
			{
				code: '<template><div>{{ n("Loading…", "Loading…", num) }}</div></template>',
			},
			{
				code: '<template><div>{{ t("files", "Loading…") }}</div></template>',
			},
			{
				code: '<template><div>{{ n("files", "Loading…", "Loading…", num) }}</div></template>',
			},
		],

		invalid: [
			{
				code: '<template><div>{{ t("Loading...") }}</div></template>',
				output: '<template><div>{{ t("Loading…") }}</div></template>',
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: '<template><div>{{ t("files", "Loading...") }}</div></template>',
				output: '<template><div>{{ t("files", "Loading…") }}</div></template>',
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: '<template><div>{{ n("Loading…", "Loading...", num) }}</div></template>',
				output: '<template><div>{{ n("Loading…", "Loading…", num) }}</div></template>',
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: '<template><div>{{ n("files", "Loading...", "Loading...", num) }}</div></template>',
				output: '<template><div>{{ n("files", "Loading…", "Loading…", num) }}</div></template>',
				errors: [{
					messageId: 'shoudUseEllipsis',
				}, {
					messageId: 'shoudUseEllipsis',
				}],
			},
		],
	})
})
