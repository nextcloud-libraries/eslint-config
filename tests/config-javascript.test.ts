/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import * as path from 'path'
import * as eslintConfig from '../lib/index.js'
import { access, copyFile, rm } from 'fs/promises'

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

test('allows Typescript like JSDoc', async () => {
	const results = await lintFile('fixtures/typescript-like-jsdoc.js')
	expect(results).toHaveIssueCount(0)
})

test('allows JSDoc syntax', async () => {
	const results = await lintFile('fixtures/jsdoc.js')
	expect(results).toHaveIssueCount(0)
})

describe('no-use-before-define', () => {
	beforeAll(async () => {
		const fixture = path.resolve(path.join(__dirname, 'fixtures/use-before-define.ts'))
		await copyFile(fixture, fixture.replace(/\.ts$/, '.js'))
	})

	afterAll(async () => {
		const fixture = path.resolve(path.join(__dirname, 'fixtures/use-before-define.ts'))
			.replace(/\.ts$/, '.js')

		try {
			await access(fixture)
			await rm(fixture)
		} catch {
			// skip
		}
	})

	test('allows functions', async () => {
		const results = await lintFile('fixtures/use-before-define.js')

		expect(results).toHaveIssueCount(1)
		expect(results).toHaveIssue({
			ruleId: 'no-use-before-define',
			line: 7,
		})
	})
})
