/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { RuleTester } from 'eslint'
import { describe, test } from 'vitest'
import rule from './no-long-imports.ts'

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

describe('no-long-imports', () => {
	const ruleTester = new RuleTester()

	test('no-long-imports', () => {
		ruleTester.run('no-long-imports', rule, {
			valid: [
				{
					code: "import NcButton from '@nextcloud/vue/components/NcButton'",
					options: [{ targetVersion: '8.23.1' }],
				},
				{
					code: "import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'",
					options: [{ targetVersion: '8.22.0' }],
				},
			],

			invalid: [
				{
					code: "import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'",
					options: [{ targetVersion: '8.23.0' }],
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
					options: [{ targetVersion: '8.23.0' }],
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
					options: [{ targetVersion: '8.23.0' }],
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
					options: [{ targetVersion: '8.23.0' }],
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
					options: [{ targetVersion: '8.23.0' }],
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
					options: [{ targetVersion: '8.23.0' }],
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
