/*!
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { existsSync } from 'fs'
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
	let file = `fixtures/codestyle/input/${testCase}.`
	if (existsSync(join(__dirname, file) + 'js')) {
		file += 'js'
	} else {
		file += 'ts'
	}

	const path = resolve(join(__dirname, file))
	const content = await readFile(path)
	const results = await eslint.lintText(content.toString(), { filePath: `src/${file}` })
	return { results, path }
}

test.for([
	'array',
	'arrow-function',
	'function',
	'exports',
	'imports',
	'indention',
	'objects',
	'quotes',
	'semicolons',
])('Code style', async (testCase: string) => {
	const { results, path } = await lintTestCase(testCase)
	expect(results).toHaveLength(1)
	await expect(results[0].output).toMatchFileSnapshot(path.replace('input', 'output'))
})
