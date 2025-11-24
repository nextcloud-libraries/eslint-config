/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { gte } from 'semver'
import { describe, test, vi } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './no-deprecated-exports.ts'

const createLibVersionValidator = vi.hoisted(() => vi.fn(() => (version: string) => !!version))

vi.mock('../utils/lib-version-parser.ts', () => ({
	createLibVersionValidator,
}))

describe('no-deprecated-exports', () => {
	const ruleTester = new RuleTester({
		languageOptions: {
			parser: vueParser,
			ecmaVersion: 2015,
		},
	})

	test('no-deprecated-exports if library is not in use', () => {
		createLibVersionValidator.mockReturnValue(() => false)
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
		createLibVersionValidator.mockReturnValue((version: string) => gte('8.22.0', version))
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

	test('no-deprecated-exports for dist syntax', () => {
		createLibVersionValidator.mockReturnValue((version: string) => gte('8.23.1', version))
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

	test('no-deprecated-exports for removed content', () => {
		createLibVersionValidator.mockReturnValue((version: string) => gte('8.31.0', version))
		ruleTester.run('no-deprecated-exports', rule, {
			valid: [
				{
					code: '<script>import NcButton from \'@nextcloud/vue/components/NcButton\'</script>',
					filename: '/a/src/component.vue',
				},
			],

			invalid: [
				{
					code: '<script>import isMobile from \'@nextcloud/vue/mixins/isMobile\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedMixin' }],
				},
				{
					code: '<script>import NcSettingsInputText from \'@nextcloud/vue/components/NcSettingsInputText\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedNcSettingsInputText' }],
				},
				{
					code: '<script>import Tooltip from \'@nextcloud/vue/directives/Tooltip\'</script>',
					filename: '/a/src/component.vue',
					errors: [{ messageId: 'deprecatedTooltip' }],
				},
			],
		})
	})
})
