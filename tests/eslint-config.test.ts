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
