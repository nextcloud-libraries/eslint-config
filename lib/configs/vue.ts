/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'
import type { ConfigOptions } from '../types.d.ts'

import vuePlugin from 'eslint-plugin-vue'
import {
	GLOB_FILES_JAVASCRIPT,
	GLOB_FILES_TYPESCRIPT,
	GLOB_FILES_VUE,
} from '../globs.ts'
import nextcloudVuePlugin from '../plugins/nextcloud-vue/index.ts'
import { codeStyle } from './codeStyle.ts'

const stylisticRules = codeStyle({
	isLibrary: false,
	vueIsTypescript: false,
}).reduce((rules, config) => ({
	...rules,
	...(config.rules ?? {}),
}), {})

const vueStylisticRules = Object.keys(vuePlugin.rules)
	.filter((rule) => `@stylistic/${rule}` in stylisticRules)
	.map((rule) => [
		`vue/${rule}`,
		stylisticRules[`@stylistic/${rule}`],
	])

/**
 * General vue related rules for both versions
 *
 * @param options options defining the config preset flavor
 */
export function vue(options: ConfigOptions): Linter.Config[] {
	return [
		...(options.vueIsTypescript
			? [
					{
						languageOptions: {
							parserOptions: {
								parser: '@typescript-eslint/parser',
							},
						},
					},
				]
			: []),

		{
			files: GLOB_FILES_VUE,
			name: 'nextcloud/vue/rules',
			rules: {
				// PascalCase components names for vuejs
				'vue/component-name-in-template-casing': [
					'error',
					'PascalCase',
				],
				// space before self-closing elements
				'vue/html-closing-bracket-spacing': 'error',
				// no ending html tag on a new line
				'vue/html-closing-bracket-newline': [
					'error',
					{
						multiline: 'never',
					},
				],
				// Enforce documentation of properties
				'vue/require-prop-comment': options.isLibrary
					? [
							'error',
							{
								type: 'JSDoc',
							},
						]
					: 'off',
				// When a prop allows Boolean and some other type, then Boolean should come first to allow short-hand properties
				'vue/prefer-prop-type-boolean-first': 'error',
				// Prevent useless string interpolation where not needed
				'vue/no-useless-mustaches': 'error',
				// If there is a default then it is not required - this is either way a bug
				'vue/no-required-prop-with-default': 'error',
				// Omit empty blocks
				'vue/no-empty-component-block': 'error',
				// Boolean properties should behave like HTML properties
				'vue/no-boolean-default': [
					'warn',
					'default-false',
				],
				// Allow 3 attributes on the same line if singe line
				'vue/max-attributes-per-line': [
					'error',
					{
						singleline: {
							max: 3,
						},
					},
				],
				// Component names should match their export names - readability and maintainability ("where does this component come from?")
				'vue/match-component-import-name': 'error',
				'vue/match-component-file-name': 'error',
				// Prevent useless v-bind like `<foo :bar="'bar'"/>`
				'vue/no-useless-v-bind': 'error',
				// Warn on undefined components - we need this on warning level as long as people use mixins (then we can move to error)
				'vue/no-undef-components': [
					'warn',
					{
						// Ignore the router link and view as this is (most often) globally registered
						ignorePatterns: ['RouterLink', 'RouterView'],
					},
				],
				// Warn on unused refs
				'vue/no-unused-refs': 'warn',
				// Warn on unused props
				'vue/no-unused-properties': 'warn',

				// This rule does not work in vue files, we must use the vue one
				'no-irregular-whitespace': 'off',
				'vue/no-irregular-whitespace': 'error',
			},
		},

		{
			files: GLOB_FILES_VUE,
			name: 'nextcloud/vue/stylistic-rules',
			rules: {
				// same as the stylistic rules but for the <template> in Vue files
				...Object.fromEntries(vueStylisticRules),
				// same as in the codeStyle config but for the <template> in Vue files
				'@nextcloud-l10n/non-breaking-space-vue': 'error',
				'@nextcloud-l10n/enforce-ellipsis-vue': 'error',
				// Also enforce tabs for template
				'vue/html-indent': [
					'error',
					'tab',
				],
				// Consistent style of props
				'vue/new-line-between-multi-line-property': 'error',
				// Add consistent padding between blocks
				'vue/padding-line-between-blocks': 'error',
				// Prefer separated static and dynamic class attributes
				'vue/prefer-separate-static-class': 'error',
				// For consistent layout of components
				'vue/define-macros-order': [
					'error', {
						order: [
							'defineOptions',
							'defineModel',
							'defineProps',
							'defineEmits',
							'defineSlots',
							'defineExpose',
						],
					},
				],
			},
		},

		{
			files: [
				...GLOB_FILES_JAVASCRIPT,
				...GLOB_FILES_TYPESCRIPT,
				...GLOB_FILES_VUE,
			],
			plugins: {
				'@nextcloud/vue': nextcloudVuePlugin,
			},
			rules: {
				'@nextcloud/vue/no-deprecated-exports': 'error',
				'@nextcloud/vue/no-deprecated-props': 'error',
			},
			name: 'nextcloud/vue/migration-rules',
		},
	]
}
