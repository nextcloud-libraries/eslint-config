/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { describe, test } from 'vitest'
import vueParser from 'vue-eslint-parser'
import rule from './no-deprecated-props.ts'

RuleTester.describe = describe
RuleTester.it = test

const ruleTester = new RuleTester({
	languageOptions: {
		parser: vueParser,
		ecmaVersion: 2015,
	},
})

ruleTester.run('no-deprecated-props', rule, {
	valid: [
		{
			code: '<template><NcButton variant="primary">Hello</NcButton></template>',
			filename: 'test.vue',
		},
		{
			code: '<template><NcButton type="submit">Hello</NcButton></template>',
			filename: 'test.vue',
		},
		{
			code: '<template><NcButton variant="tertiary-no-background" type="reset">Hello</NcButton></template>',
			filename: 'test.vue',
		},
		{
			code: '<template><NcButton :type="isReset ? \'reset\' : \'submit\'">Hello</NcButton></template>',
			filename: 'test.vue',
		},
		{
			code: '<template><NcButton :variant="isPrimary ? \'primary\' : \'tertiary\'">Hello</NcButton></template>',
			filename: 'test.vue',
		},
	],
	invalid: [
		{
			code: '<template><NcButton type="primary">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcButton variant="primary">Hello</NcButton></template>',
		},
		{
			code: '<template><NcActions type="primary">Hello</NcActions></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcActions variant="primary">Hello</NcActions></template>',
		},
		{
			code: '<template><NcAppNavigationNew type="primary" text="Hello" /></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcAppNavigationNew variant="primary" text="Hello" /></template>',
		},
		{
			code: '<template><NcChip type="primary" text="Hello" /></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcChip variant="primary" text="Hello" /></template>',
		},
		{
			code: '<template><NcDialogButton type="primary">Hello</NcDialogButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcDialogButton variant="primary">Hello</NcDialogButton></template>',
		},
		{
			code: '<template><NcButton type="tertiary">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcButton variant="tertiary">Hello</NcButton></template>',
		},
		{
			code: '<template><NcButton type="error">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcButton variant="error">Hello</NcButton></template>',
		},
		{
			code: '<template><NcButton native-type="button">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useTypeInstead' }],
			output: '<template><NcButton type="button">Hello</NcButton></template>',
		},
		{
			code: '<template><NcDialogButton native-type="button">Hello</NcDialogButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useTypeInstead' }],
			output: '<template><NcDialogButton type="button">Hello</NcDialogButton></template>',
		},
		{
			code: '<template><NcButton type="primary" native-type="button">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }, { messageId: 'useTypeInstead' }],
			output: '<template><NcButton variant="primary" type="button">Hello</NcButton></template>',
		},
		{
			code: '<template><NcButton :type="isPrimary ? \'primary\' : \'secondary\'">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcButton :variant="isPrimary ? \'primary\' : \'secondary\'">Hello</NcButton></template>',
		},
		{
			code: '<template><NcButton :type="buttonType" :native-type="nativeType">Hello</NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }, { messageId: 'useTypeInstead' }],
			output: '<template><NcButton :variant="buttonType" :type="nativeType">Hello</NcButton></template>',
		},
		// from Talk app
		{
			code: '<template><NcButton v-show="!loading" type="tertiary" @click="handle"><template #icon><IconDelete /></template></NcButton></template>',
			filename: 'test.vue',
			errors: [{ messageId: 'useVariantInstead' }],
			output: '<template><NcButton v-show="!loading" variant="tertiary" @click="handle"><template #icon><IconDelete /></template></NcButton></template>',
		},
	],
})
