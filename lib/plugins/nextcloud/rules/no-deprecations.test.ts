/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { RuleTester } from 'eslint'
import { describe, test } from 'vitest'
import rule from './no-deprecations.js'

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

describe('no-deprecations', () => {
	const ruleTester = new RuleTester()

	test('no-deprecations', () => {
		ruleTester.run('no-deprecations', rule, {
			valid: [
				{
					code: "var escapeHTML = require('escape-html'); var sanitized = escapeHTML('hello')",
				},
			],

			invalid: [
				{
					code: 'var date = relative_modified_date(123)',
					errors: [
						{
							message: 'The global property or function relative_modified_date was deprecated in Nextcloud 16.0.0',
							type: 'Program',
						},
					],
				},
				{
					code: "$('body').text()",
					errors: [
						{
							message: 'The global property or function $ was deprecated in Nextcloud 19.0.0',
							type: 'Program',
						},
					],
				},
				{
					code: 'OC.getHost()',
					errors: [
						{
							message: 'The property or function OC.getHost was deprecated in Nextcloud 17.0.0',
							type: 'MemberExpression',
						},
					],
				},
				{
					code: "OCP.Toast.success('hello')",
					errors: [
						{
							message: 'The property or function OCP.Toast was deprecated in Nextcloud 19.0.0',
							type: 'MemberExpression',
						},
					],
				},
				{
					code: 'var clean = DOMPurify.sanitize(dirty);',
					errors: [
						{
							message: 'The global property or function DOMPurify was deprecated in Nextcloud 18.0.0',
							type: 'Program',
						},
					],
				},
			],
		})
	})

	test('no-deprecations with target version', () => {
		ruleTester.run('no-deprecations with target version', rule, {
			valid: [
				{
					name: 'manual target version lower than deprecation',
					code: "OCP.Toast.success('hello')",
					options: [{ targetVersion: '18.0.0' }],
				},
				{
					name: 'manual target version lower than deprecation (short version)',
					code: "OCP.Toast.success('hello')",
					options: [{ targetVersion: '18' }],
				},
				{
					name: 'appinfo max-version lower than deprecation',
					code: 'OC.L10n.translate()',
					options: [{ parseAppInfo: true }],
					filename: 'tests/fixtures/valid-appinfo/some-file.js',
				},
			],

			invalid: [
				{
					name: 'manual target version higher than deprecation',
					code: 'OC.L10n.translate()',
					options: [{ targetVersion: '27.0.0' }],
					errors: [
						{
							message: 'The property or function OC.L10n was deprecated in Nextcloud 26.0.0',
							type: 'MemberExpression',
						},
					],
				},
			],
		})
	})
})
