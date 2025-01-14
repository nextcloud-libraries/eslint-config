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
	fix: true,
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>,
})

const lintFile = async (file) => {
	const real = path.resolve(path.join(__dirname, file))
	return await eslint.lintFiles(real)
}

test.for([
	'array',
	'arrow-function',
	'function',
	'indention',
	'objects',
	'quotes',
	'semicolons',
])('Code style', async (testCase: string) => {
	const results = await lintFile(`fixtures/codestyle/input/${testCase}.{t,j}s`)
	expect(results).toHaveLength(1)
	expect(results[0].output).toMatchFileSnapshot(results[0].filePath.replace('input', 'output'))
})
