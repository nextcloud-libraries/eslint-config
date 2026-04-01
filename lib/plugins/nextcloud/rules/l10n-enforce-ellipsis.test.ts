/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { test } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './l10n-enforce-ellipsis.ts'

test('rule: l10n-enforce-ellipsis', () => {
	const ruleTester = new RuleTester()

	ruleTester.run('l10n-enforce-ellipsis', rule, {
		valid: [
			{
				code: 'const foo = t("Loading…")',
			},
			{
				code: 'const foo = n("Loading…", "Loading…", num)',
			},
			{
				code: 'const foo = n("files", "Loading…", "Loading…", num)',
			},
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
			/* eslint-disable @nextcloud/l10n-non-breaking-space */
			{
				code: 't("Loading...")',
				output: 't("Loading…")',
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: 't("files", "Loading...")',
				output: 't("files", "Loading…")',
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: "t('Loading ...')",
				output: "t('Loading …')",
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: "const foo = n('Loading %n …', 'Loading %n ...', num)",
				output: "const foo = n('Loading %n …', 'Loading %n …', num)",
				errors: [{
					messageId: 'shoudUseEllipsis',
				}],
			},
			{
				code: "const foo = n('files', 'Loading %n ...', 'Loading %n ...', num)",
				output: "const foo = n('files', 'Loading %n …', 'Loading %n …', num)",
				errors: [{
					messageId: 'shoudUseEllipsis',
				}, {
					messageId: 'shoudUseEllipsis',
				}],
			},
			/* eslint-enable @nextcloud/l10n-non-breaking-space */
		],
	})
})

test('rule: l10n-enforce-ellipsis in vue templates', () => {
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
