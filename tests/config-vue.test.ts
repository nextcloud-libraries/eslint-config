/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Linter } from 'eslint'

import { ESLint } from 'eslint'
import { readFile } from 'fs/promises'
import { join, resolve } from 'path'
import { expect, test } from 'vitest'
import * as eslintConfig from '../lib/index.js'

const eslint = new ESLint({
	overrideConfigFile: true,
	overrideConfig: eslintConfig.recommended as Linter.Config<Linter.RulesRecord>[],
})

/**
 * Lint a file with ESLint
 *
 * @param file - File path to lint
 * @return Lint result
 */
async function lintFile(file: string) {
	const real = resolve(join(__dirname, file))
	const content = await readFile(real)
	return await eslint.lintText(content.toString(), { filePath: join('src', file) })
}

test('Formatting', async () => {
	const results = await lintFile('fixtures/component-formatting.vue')
	expect(results).toHaveIssueCount(3)
	expect(results).toHaveIssue({
		ruleId: 'vue/prop-name-casing',
		line: 11,
	})
	expect(results).toHaveIssue({
		ruleId: 'vue/custom-event-name-casing',
		line: 31,
	})
	expect(results).toHaveIssue({
		ruleId: 'vue/slot-name-casing',
		line: 34,
	})
})
