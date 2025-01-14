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
	overrideConfig: eslintConfig.recommendedJavascript as Linter.Config<Linter.RulesRecord>[],
})

const lintFile = async (file) => {
	const real = path.resolve(path.join(__dirname, file))
	return await eslint.lintFiles(real)
}

test('some basic issues should fail', async () => {
	const results = await lintFile('fixtures/example-fail.js')
	expect(results).toHaveIssueCount(3)
	expect(results).toHaveIssue('@stylistic/spaced-comment')
	expect(results).toHaveIssue('@stylistic/semi')
	expect(results).toHaveIssue({
		ruleId: 'no-console',
		line: 7,
	})
})

test('TSX is linted', async () => {
	const ignored = await eslint.isPathIgnored('./fixtures/some.tsx')
	expect(ignored).toBe(false)

	const results = await lintFile('fixtures/some.tsx')
	expect(results).toHaveIssue({
		ruleId: 'jsdoc/check-tag-names',
		line: 10,
	})
	expect(results).toHaveIssue({
		ruleId: '@typescript-eslint/no-unused-vars',
		line: 12,
	})
	expect(results).toHaveIssueCount(2)
})

test('ignore camelcase for webpack', async () => {
	const results = await lintFile('fixtures/webpack-nonce.js')
	expect(results).toHaveIssueCount(0)
})

test('works with Vue Composition API', async () => {
	const results = await lintFile('fixtures/composition-test.vue')
	expect(results).toHaveIssueCount(0)
})
