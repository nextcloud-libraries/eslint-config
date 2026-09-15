/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import rule from './consistent-copyright-header.ts'

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
})

describe('consistent-copyright-header', () => {
	it('should pass with correct /*! format and empty line after SPDX header', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [
				{
					code: `/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

console.log('hello')`,
				},
			],
			invalid: [],
		})
	})

	it('should pass with correct /*! format and empty line after old copyright comment', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [
				{
					code: `/*!
 * Copyright (c) 2025 Nextcloud GmbH
 */

console.log('hello')`,
				},
			],
			invalid: [],
		})
	})

	it('should pass with no comments', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [
				{
					code: 'console.log("no comments here")',
				},
			],
			invalid: [],
		})
	})

	it('should skip if the first comment is not at the beginning', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [
				{
					code: `console.log('hello')
/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */`,
				},
			],
			invalid: [],
		})
	})

	it('should skip if the first comment is not a copyright comment', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [
				{
					code: `/**
 * A regular JSDoc comment before Foo function
 *
 * @param bar {any} - Bar
 */
function foo(bar) {}`,
				},
			],
			invalid: [],
		})
	})

	it('should fix JSDoc style /** to /*! format', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [],
			invalid: [
				{
					code: `/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

console.log('hello')`,
					errors: [{ messageId: 'wrongCommentFormat', data: { format: '/**' } }],
					output: `/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

console.log('hello')`,
				},
			],
		})
	})

	it('should fix regular /* to /*! format', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [],
			invalid: [
				{
					code: `/*
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

console.log('hello')`,
					errors: [{ messageId: 'wrongCommentFormat', data: { format: '/*' } }],
					output: `/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

console.log('hello')`,
				},
			],
		})
	})

	it('should add an empty line after copyright without a single newline', () => {
		ruleTester.run('consistent-copyright-header', rule, {
			valid: [],
			invalid: [
				{
					code: `/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
console.log('hello')`,
					errors: [{ messageId: 'missingEmptyLine' }],
					output: `/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

console.log('hello')`,
				},
			],
		})
	})
})
