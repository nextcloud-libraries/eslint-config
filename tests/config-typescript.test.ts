/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import * as path from 'path'
import { describe, expect, test } from 'vitest'

import * as eslintConfig from '../lib/index.ts'

const eslint = new ESLint({
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>,
})

describe('Typescript', () => {
	async function lintFile(file: string) {
		const real = path.resolve(path.join(__dirname, file))
		return await eslint.lintFiles(real)
	}

	test('works with Typescript + Vue', async () => {
		const results = await lintFile('fixtures/typescript-test.vue')
		expect(results).toHaveIssueCount(0)
	})

	test('overrides have higher priority than vue', async () => {
		const results = await lintFile('fixtures/typescript-vue-overrides.vue')
		expect(results).toHaveIssueCount(1)
		// Expect "'@type' is redundant when using a type system."
		expect(results).toHaveIssue({
			ruleId: 'jsdoc/check-tag-names',
			line: 15,
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
