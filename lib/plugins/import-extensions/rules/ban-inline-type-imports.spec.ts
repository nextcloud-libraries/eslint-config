/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import parser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { test } from 'vitest'
import { rule } from './ban-inline-type-imports.ts'

const ruleTester = new RuleTester({
	languageOptions: {
		parser,
	},
})

test('ban-inline-type-imports', () => {
	ruleTester.run('ban-inline-type-imports', rule, {
		valid: [
			{
				code: 'import { join } from "node:path"',
				filename: '/a/src/test.ts',
			},
			{
				code: 'import * as main from "./main.js"',
				filename: '/a/src/test.ts',
			},
			{
				code: 'import View from "./view.vue"',
				filename: '/a/src/test.ts',
			},
			{
				code: 'import type MyClass from "./nested/child.ts"',
				filename: '/a/src/test4ts',
			},
			{
				code: 'import type { some } from "../main.js"',
				filename: '/a/src/test.ts',
			},
			{
				code: 'import Foo, { foo } from "../img/icon.svg?raw"',
				filename: '/a/src/test.ts',
			},
		],
		invalid: [
			// only inline types
			{
				code: 'import { type foo, type bar } from "./main.ts"',
				filename: '/a/src/test.ts',
				errors: [{
					messageId: 'preferTopLevel',
				}],
				output: 'import type {foo, bar} from "./main.ts";',
			},
			// mixed type imports
			{
				code: 'import { Foo, type Bar } from "./main.ts";',
				filename: '/a/src/test.ts',
				errors: [{
					messageId: 'preferTopLevel',
				}],
				output: 'import { Foo } from "./main.ts";\nimport type {Bar} from "./main.ts";',
			},
			{
				code: 'import { type Foo, Bar } from "./main.ts";',
				filename: '/a/src/test.ts',
				errors: [{
					messageId: 'preferTopLevel',
				}],
				output: 'import { Bar } from "./main.ts";\nimport type {Foo} from "./main.ts";',
			},
			// mixed type imports with default
			{
				code: 'import Foo, { type Bar } from "./main.ts";',
				filename: '/a/src/test.ts',
				errors: [{
					messageId: 'preferTopLevel',
				}],
				output: 'import Foo from "./main.ts";\nimport type {Bar} from "./main.ts";',
			},
		],
	})
})
