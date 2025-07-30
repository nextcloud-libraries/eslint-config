/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RuleTester } from 'eslint'
import { fs, vol } from 'memfs'
import { beforeEach, test, vi } from 'vitest'
import rule, { clearCache } from './extensions.ts'

vi.mock('fs', () => fs)
vi.mock('node:fs', () => fs)

const ruleTester = new RuleTester()

beforeEach(() => {
	vol.reset()
	clearCache()
})

test('import-extensions: relative files', () => {
	vol.fromNestedJSON({
		'/a': {
			css: {
				'some.css': '/* ... */',
			},
			img: {
				'icon.svg': '<svg />',
			},
			src: {
				'main.js': 'import { join } from "node:path"',
				'view.vue': '<template><div>hello</div></template>',
				'component.vue': '<template><div>hello</div></template>',
				'component.css': '/* ... */',

				nested: {
					'child.ts': '/* ... */',
				},
			},
		},
	}, '/a')

	ruleTester.run('imports', rule, {
		valid: [
			{
				code: 'import { join } from "node:path"',
				filename: '/a/src/test1.js',
			},
			{
				code: 'import * as main from "./main.js"',
				filename: '/a/src/test2.js',
			},
			{
				code: 'import View from "./view.vue"',
				filename: '/a/src/test3.js',
			},
			{
				code: 'import * as child from "./nested/child.ts"',
				filename: '/a/src/test4.js',
			},
			{
				code: 'import * as main from "../main.js"',
				filename: '/a/src/nested/test.js',
			},
			{
				code: 'import svg from "../img/icon.svg?raw"',
				filename: '/a/src/test.js',
			},
		],
		invalid: [
			// missing extension in same folder
			{
				code: 'import "./main"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.js', type: 'import' },
						output: 'import "./main.js"',
					}],
				}],
			},
			// missing extension in same folder - non node resolveable
			{
				code: 'import View from "./view"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.vue', type: 'import' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.vue', type: 'import' },
						output: 'import View from "./view.vue"',
					}],
				}],
			},
			// missing extension in nested folder
			{
				code: 'import * as child from "./nested/child"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.ts', type: 'import' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.ts', type: 'import' },
						output: 'import * as child from "./nested/child.ts"',
					}],
				}],
			},
			// missing extension in parent folder
			{
				code: 'import * as main from "../main"',
				filename: '/a/src/nested/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.js', type: 'import' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.js', type: 'import' },
						output: 'import * as main from "../main.js"',
					}],
				}],
			},
			// missing extension of non node resolvable file
			{
				code: 'import "../css/some"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.css', type: 'import' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.css', type: 'import' },
						output: 'import "../css/some.css"',
					}],
				}],
			},
			// with import query
			{
				code: 'import svg from "../img/icon?raw"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.svg', type: 'import' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.svg', type: 'import' },
						output: 'import svg from "../img/icon.svg?raw"',
					}],
				}],
			},
			// missing extension non unique name
			{
				code: 'import "./component"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'missingExtension',
					data: { type: 'import' },
					suggestions: [
						{
							messageId: 'applySuggestedExtension',
							data: { extension: '.vue', type: 'import' },
							output: 'import "./component.vue"',
						},
						{
							messageId: 'applySuggestedExtension',
							data: { extension: '.css', type: 'import' },
							output: 'import "./component.css"',
						},
					],
				}],
			},
			// non existing file
			{
				code: 'import "./nop/foo"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'missingExtension',
					data: { type: 'import' },
				}],
			},
		],
	})
})

test('import-extensions: exports', () => {
	vol.fromNestedJSON({
		'/a': {
			src: {
				'main.js': 'import { join } from "node:path"',
				'view.vue': '<template><div>hello</div></template>',
				'component.vue': '<template><div>hello</div></template>',
				'component.jsx': '/* ... */',

				nested: {
					'child.ts': '/* ... */',
				},
			},
		},
	}, '/a')

	ruleTester.run('exports', rule, {
		valid: [
			{
				code: 'export { join } from "node:path"',
				filename: '/a/src/test1.js',
			},
			{
				code: 'export * as main from "./main.js"',
				filename: '/a/src/test2.js',
			},
			{
				code: 'export { default as View } from "./view.vue"',
				filename: '/a/src/test3.js',
			},
			{
				code: 'export * from "./nested/child.ts"',
				filename: '/a/src/test4.js',
			},
			{
				code: 'export * from "../main.js"',
				filename: '/a/src/nested/test.js',
			},
		],
		invalid: [
			// missing extension in same folder
			{
				code: 'export * from "./main"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.js', type: 'export' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.js', type: 'export' },
						output: 'export * from "./main.js"',
					}],
				}],
			},
			// missing extension in same folder - non node resolveable
			{
				code: 'export { default as View } from "./view"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.vue', type: 'export' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.vue', type: 'export' },
						output: 'export { default as View } from "./view.vue"',
					}],
				}],
			},
			// missing extension in nested folder
			{
				code: 'export * from "./nested/child"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.ts', type: 'export' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.ts', type: 'export' },
						output: 'export * from "./nested/child.ts"',
					}],
				}],
			},
			// missing extension in parent folder
			{
				code: 'export * from "../main"',
				filename: '/a/src/nested/test.js',
				errors: [{
					messageId: 'recommendedMissingExtension',
					data: { extension: '.js', type: 'export' },
					suggestions: [{
						messageId: 'applySuggestedExtension',
						data: { extension: '.js', type: 'export' },
						output: 'export * from "../main.js"',
					}],
				}],
			},
			// missing extension non unique name
			{
				code: 'export { default as MyComponent } from "./component"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'missingExtension',
					data: { type: 'export' },
					suggestions: [
						{
							messageId: 'applySuggestedExtension',
							data: { extension: '.vue', type: 'export' },
							output: 'export { default as MyComponent } from "./component.vue"',
						},
						{
							messageId: 'applySuggestedExtension',
							data: { extension: '.jsx', type: 'export' },
							output: 'export { default as MyComponent } from "./component.jsx"',
						},
					],
				}],
			},
			// non existing file
			{
				code: 'export * from "./nop/foo"',
				filename: '/a/src/test.js',
				errors: [{
					messageId: 'missingExtension',
					data: { type: 'export' },
				}],
			},
		],
	})
})
