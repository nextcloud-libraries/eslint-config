import { ESLint } from "eslint"
import type { Linter } from "eslint"
import * as path from 'path'
import * as eslintConfig from '../typescript.js'


const eslint = new ESLint({
	baseConfig: eslintConfig as unknown as Linter.Config<Linter.RulesRecord>
})

const lintFile = async (file) => {
	const real = path.resolve(path.join(__dirname, file))
	return await eslint.lintFiles(real)
}

test('works with Typescript + Vue', async () => {
	const results = await lintFile('fixtures/typescript-test.vue')
	expect(results).toHaveIssueCount(0)
})