/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { RuleTester } from 'eslint'
import { fs, vol } from 'memfs'
import { afterAll, beforeAll, describe, test, vi } from 'vitest'
import rule from './no-deprecated-exports.ts'

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

vi.mock('node:fs', () => fs)

describe('no-deprecated-exports', () => {
	beforeAll(() => vol.fromNestedJSON({
		[__dirname]: {},
		[__filename]: '...',
	}))
	afterAll(() => vol.reset())

	const ruleTester = new RuleTester()

	test('no-deprecated-exports if library is not in use', () => {
		vol.fromNestedJSON({
			'/a': {
				'package.json': '{"name": "my-app","version": "0.1.0"}',
				src: { },
			},
		}, '/a/src')
		ruleTester.run('no-deprecated-exports', rule, {
			valid: [
				{
					code: "import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'",
					filename: '/a/src/component.js',
				},
			],
			invalid: [],
		})
	})

	test('no-deprecated-exports if library has outdated version', () => {
		vol.fromNestedJSON({
			'/a': {
				'package.json': '{"name": "my-app","version": "0.1.0","dependencies":{"@nextcloud/vue":"^8.22.0"}}',
				src: { },
			},
		})
		ruleTester.run('no-deprecated-exports', rule, {
			valid: [
				{
					code: "import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'",
					filename: '/a/src/component.js',
				},
			],
			invalid: [],
		})
	})

	test('no-deprecated-exports', () => {
		vol.fromNestedJSON({
			'/a': {
				'package.json': '{"name": "my-app","version": "0.1.0","dependencies":{"@nextcloud/vue":"^8.23.1"}}',
				src: { },
			},
		})
		ruleTester.run('no-deprecated-exports', rule, {
			valid: [
				{
					code: "import NcButton from '@nextcloud/vue/components/NcButton'",
					filename: '/a/src/component.js',
				},
			],

			invalid: [
				{
					code: "import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'",
					filename: '/a/src/component.js',
					errors: [
						{
							message: 'Import from "@nextcloud/vue/dist" is deprecated',
							type: 'ImportDeclaration',
						},
					],
					output: 'import NcButton from \'@nextcloud/vue/components/NcButton\'',
				},
				{
					code: "import Tooltip from '@nextcloud/vue/dist/Directives/Tooltip.js'",
					filename: '/a/src/component.js',
					errors: [
						{
							message: 'Import from "@nextcloud/vue/dist" is deprecated',
							type: 'ImportDeclaration',
						},
					],
					output: 'import Tooltip from \'@nextcloud/vue/directives/Tooltip\'',
				},
				{
					code: "import { emojiSearch } from '@nextcloud/vue/dist/Functions/emoji.js'",
					filename: '/a/src/component.js',
					errors: [
						{
							message: 'Import from "@nextcloud/vue/dist" is deprecated',
							type: 'ImportDeclaration',
						},
					],
					output: 'import { emojiSearch } from \'@nextcloud/vue/functions/emoji\'',
				},
				{
					code: "import { useHotKey } from '@nextcloud/vue/dist/Composables/useHotKey.js'",
					filename: '/a/src/component.js',
					errors: [
						{
							message: 'Import from "@nextcloud/vue/dist" is deprecated',
							type: 'ImportDeclaration',
						},
					],
					output: 'import { useHotKey } from \'@nextcloud/vue/composables/useHotKey\'',
				},
				{
					code: "import { useHotKey } from '@nextcloud/vue/dist/Composables/useHotKey/index.js'",
					filename: '/a/src/component.js',
					errors: [
						{
							message: 'Import from "@nextcloud/vue/dist" is deprecated',
							type: 'ImportDeclaration',
						},
					],
					output: 'import { useHotKey } from \'@nextcloud/vue/composables/useHotKey\'',
				},
				{
					code: "import isMobile from '@nextcloud/vue/dist/Mixins/isMobile.js'",
					filename: '/a/src/component.js',
					errors: [
						{
							message: 'Import from "@nextcloud/vue/dist" is deprecated',
							type: 'ImportDeclaration',
						},
					],
					output: 'import isMobile from \'@nextcloud/vue/mixins/isMobile\'',
				},
			],
		})
	})
})
