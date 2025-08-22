/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { readFile } from 'fs/promises'
import { join, resolve } from 'path'
import { describe, expect, test } from 'vitest'
import * as eslintConfig from '../lib/index.js'

const eslint = new ESLint({
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>,
})

describe('Typescript', () => {
	async function lintFile(file: string) {
		const real = resolve(join(__dirname, file))
		const content = await readFile(real)
		return await eslint.lintText(content.toString(), { filePath: join('src', file) })
	}

	// Vue files can be both Javascript and Typescript
	describe('Vue', () => {
		test('works with Typescript + Vue', async () => {
			const results = await lintFile('fixtures/typescript-test.vue')
			expect(results).toHaveIssueCount(0)
		})

		test('overrides have higher priority than vue', async () => {
			const results = await lintFile('fixtures/typescript-vue-overrides.vue')
			// In Javascript rules this rule is no-use-before-define, not @typescript-eslint/no-use-before-define
			expect(results).toHaveIssueCount(1)
			expect(results).toHaveIssue('@typescript-eslint/no-use-before-define')
		})

		test('with lang="ts" does not require types in JSDoc', async () => {
			const results = await lintFile('fixtures/JsdocTypescriptWithoutTypes.vue')
			expect(results).toHaveIssueCount(0)
		})

		test('without lang="ts" requires types in JSDoc like in Javascript files', async () => {
			const results = await lintFile('fixtures/JsdocJavascriptWithoutTypes.vue')
			expect(results).toHaveIssueCount(20)
			expect(results).toHaveIssue('jsdoc/require-param-type')
		})

		test('with lang="ts" does not allow types in JSDoc', async () => {
			const results = await lintFile('fixtures/JsdocTypescriptWithTypes.vue')
			expect(results).toHaveIssueCount(24)
			expect(results).toHaveIssue('jsdoc/no-types')
		})

		test('without lang="ts" allows types in JSDoc like in Javascript files', async () => {
			const results = await lintFile('fixtures/JsdocJavascriptWithTypes.vue')
			expect(results).toHaveIssueCount(0)
		})
	})

	test('no-use-before-define allows functions', async () => {
		const results = await lintFile('fixtures/use-before-define.ts')

		expect(results).toHaveIssueCount(1)
		expect(results).toHaveIssue({
			ruleId: '@typescript-eslint/no-use-before-define',
			line: 7,
		})
	})

	test('no-use-before-define allows functions', async () => {
		const results = await lintFile('fixtures/use-before-define.ts')

		expect(results).toHaveIssueCount(1)
		expect(results).toHaveIssue({
			ruleId: '@typescript-eslint/no-use-before-define',
			line: 7,
		})
	})

	test('does not allow JSDoc syntax', async () => {
		const results = await lintFile('fixtures/jsdoc.ts')

		expect(results).toHaveIssueCount(3)
		expect(results).toHaveIssue('jsdoc/check-tag-names')
		expect(results).toHaveIssue('jsdoc/no-types')
	})
})
