/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { join, resolve } from 'path'
import { expect, test } from 'vitest'

import * as eslintConfig from '../lib/index.ts'

const eslint = new ESLint({
	fix: true,
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>,
})

const lintFile = async (file) => {
	const real = resolve(join(__dirname, file))
	return await eslint.lintFiles(real)
}

test.for([
	'array',
	'arrow-function',
	'function',
	'imports',
	'indention',
	'objects',
	'quotes',
	'semicolons',
])('Code style', async (testCase: string) => {
	const results = await lintFile(`fixtures/codestyle/input/${testCase}.{t,j}s`)
	expect(results).toHaveLength(1)
	await expect(results[0].output).toMatchFileSnapshot(results[0].filePath.replace('input', 'output'))
})
