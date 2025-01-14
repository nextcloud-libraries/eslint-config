/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { expect, test } from 'vitest'
import * as path from 'path'
import * as eslintConfig from '../lib/index.js'

const eslint = new ESLint({
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>,
})

const lintFile = async (file) => {
	const real = path.resolve(path.join(__dirname, file))
	return await eslint.lintFiles(real)
}

test('works with Typescript + Vue', async () => {
	const results = await lintFile('fixtures/typescript-test.vue')
	expect(results).toHaveIssueCount(0)
})

test('Typescript overrides have higher priority than vue', async () => {
	const results = await lintFile('fixtures/typescript-vue-overrides.vue')
	expect(results).toHaveIssueCount(1)
	// Expect "'@type' is redundant when using a type system."
	expect(results).toHaveIssue({
		ruleId: 'jsdoc/check-tag-names',
		line: 15,
	})
})
