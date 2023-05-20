import { ESLint } from "eslint"
import type { Linter } from "eslint"
import * as path from 'path'
import * as eslintConfig from '../index.js'


const eslint = new ESLint({
	baseConfig: eslintConfig as unknown as Linter.Config<Linter.RulesRecord>
})

const lintFile = async (file) => {
	const real = path.resolve(path.join(__dirname, file))
	return await eslint.lintFiles(real)
}

test('some basic issues should fail', async () => {
	const results = await lintFile('fixtures/example-fail.js')
	expect(results).toHaveIssueCount(3)
	expect(results).toHaveIssue('spaced-comment')
	expect(results).toHaveIssue({ ruleId: 'no-console', line: 3 })
})

test('TSX is linted', async () => {
	const ignored = await eslint.isPathIgnored('./fixtures/some.tsx')
	expect(ignored).toBe(false)

	const results = await lintFile('fixtures/some.tsx')
	expect(results).toHaveIssue({ruleId: 'jsdoc/check-tag-names', line: 5})
	expect(results).toHaveIssue({ruleId: '@typescript-eslint/no-unused-vars', line: 7})
	expect(results).toHaveIssueCount(2)
})

test('ignore camelcase for webpack', async () => {
	const results = await lintFile('fixtures/webpack-nonce.js')
	expect(results).toHaveIssueCount(1)
	expect(results).toHaveIssue({ruleId: 'no-undef', line: 2 })
})