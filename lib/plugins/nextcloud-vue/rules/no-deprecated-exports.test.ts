/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { fs, vol } from 'memfs'
import { afterAll, beforeAll, describe, test, vi } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './no-deprecated-exports.ts'

vi.mock('node:fs', () => fs)

describe('no-deprecated-exports', () => {
	beforeAll(() => vol.fromNestedJSON({
		[__dirname]: {},
		[__filename]: '...',
	}))
	afterAll(() => vol.reset())

	const ruleTester = new RuleTester({
		languageOptions: {
			parser: vueParser,
			ecmaVersion: 2015,
		},
	})

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
					code: '<script>import anything from \'anywhere\'</script>',
					filename: '/a/src/component.vue',
				},
			],
			invalid: [
				{
					code: '<script>import NcButton from \'@nextcloud/vue/dist/Components/NcButton.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'outdatedVueLibrary' }],
				},
			],
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
					code: '<script>import anything from \'anywhere\'</script>',
					filename: '/a/src/component.vue',
				},
			],
			invalid: [
				{
					code: '<script>import NcButton from \'@nextcloud/vue/dist/Components/NcButton.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'outdatedVueLibrary' }],
				},
			],
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
					code: '<script>import NcButton from \'@nextcloud/vue/components/NcButton\'</script>',
					filename: '/a/src/component.vue',
				},
			],

			invalid: [
				{
					code: '<script>import NcButton from \'@nextcloud/vue/dist/Components/NcButton.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedDist' }],
					output: '<script>import NcButton from \'@nextcloud/vue/components/NcButton\'</script>',
				},
				{
					code: '<script>import Tooltip from \'@nextcloud/vue/dist/Directives/Tooltip.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedDist' }],
					output: '<script>import Tooltip from \'@nextcloud/vue/directives/Tooltip\'</script>',
				},
				{
					code: '<script>import { emojiSearch } from \'@nextcloud/vue/dist/Functions/emoji.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedDist' }],
					output: '<script>import { emojiSearch } from \'@nextcloud/vue/functions/emoji\'</script>',
				},
				{
					code: '<script>import { useHotKey } from \'@nextcloud/vue/dist/Composables/useHotKey.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedDist' }],
					output: '<script>import { useHotKey } from \'@nextcloud/vue/composables/useHotKey\'</script>',
				},
				{
					code: '<script>import { useHotKey } from \'@nextcloud/vue/dist/Composables/useHotKey/index.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedDist' }],
					output: '<script>import { useHotKey } from \'@nextcloud/vue/composables/useHotKey\'</script>',
				},
				{
					code: '<script>import isMobile from \'@nextcloud/vue/dist/Mixins/isMobile.js\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedDist' }],
					output: '<script>import isMobile from \'@nextcloud/vue/mixins/isMobile\'</script>',
				},
			],
		})
	})
})
