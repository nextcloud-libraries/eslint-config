/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { readFile } from 'fs/promises'
import { join, resolve } from 'path'
import { expect, test } from 'vitest'
import * as eslintConfig from '../lib/index.js'

const eslint = new ESLint({
	fix: true,
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>,
})

/**
 * Lint a file with ESLint
 *
 * @param file - File path to lint
 * @return Lint result
 */
async function lintTestCase(testCase: string) {
	const filepath = join('fixtures/codestyle/input/', testCase)
	const path = resolve(join(__dirname, filepath))
	const content = await readFile(path)
	const results = await eslint.lintText(content.toString(), { filePath: `src/${filepath}` })
	return { results, path }
}

test.for([
	'array.js',
	'arrow-function.ts',
	'exports.ts',
	'function.ts',
	'imports.ts',
	'indention.js',
	'objects.js',
	'quotes.js',
	'semicolons.js',
	'VueComponent.vue',
])('Code style', async (testCase: string) => {
	const { results, path } = await lintTestCase(testCase)
	expect(results).toHaveLength(1)
	await expect(results[0].output).toMatchFileSnapshot(path.replace('input', 'output'))
})
