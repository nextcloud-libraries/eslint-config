import type { Linter } from 'eslint'
import { ESLint } from 'eslint'
import { readFile } from 'fs/promises'
import * as path from 'path'
import * as eslintConfig from '../index.js'

const eslint = new ESLint({
	baseConfig: eslintConfig as unknown as Linter.Config<Linter.RulesRecord>,
	cwd: path.resolve(__dirname, 'fixtures'),
})

/**
 * Lints a given with ESLint, the file is virtually mounted at `<project-root>/<file-path>`
 *
 * @param file Virtual file path, the file content is loaded from the file path relative to the fixures folder `tests/fixtures/<file-path>`
 */
const lintFile = async (file) => {
	const real = path.resolve(path.join(__dirname, 'fixtures', file))
	const buffer = await readFile(real)
	return await eslint.lintText(buffer.toString(), {
		filePath: file,
	})
}

test('some basic issues should fail', async () => {
	const results = await lintFile('example-fail.js')
	expect(results).toHaveIssueCount(3)
	expect(results).toHaveIssue('spaced-comment')
	expect(results).toHaveIssue({ ruleId: 'no-console', line: 3 })
})

test('TSX is linted', async () => {
	const ignored = await eslint.isPathIgnored('some.tsx')
	expect(ignored).toBe(false)

	const results = await lintFile('some.tsx')
	expect(results).toHaveIssue({ ruleId: 'jsdoc/check-tag-names', line: 5 })
	expect(results).toHaveIssue({ ruleId: '@typescript-eslint/no-unused-vars', line: 7 })
	expect(results).toHaveIssueCount(2)
})

test('ignore camelcase for webpack', async () => {
	const results = await lintFile('webpack-nonce.js')
	expect(results).toHaveIssueCount(1)
	expect(results).toHaveIssue({ ruleId: 'no-undef', line: 2 })
})

test('works with Vue Composition API', async () => {
	const results = await lintFile('composition-test.vue')
	expect(results).toHaveIssueCount(0)
})

test('works with chai expressions', async () => {
	const results = await eslint.lintText('', {
		filePath: 'cypress/component/foo.cy.ts',
	})
	expect(results).toHaveIssueCount(0)
})
