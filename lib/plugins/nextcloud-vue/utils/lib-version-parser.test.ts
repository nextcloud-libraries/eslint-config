/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { fs, vol } from 'memfs'
import { beforeEach } from 'node:test'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { clearCache, createLibVersionValidator } from './lib-version-parser.ts'

vi.mock('node:fs', () => fs)

describe('createLibVersionValidator', () => {
	beforeAll(() => vol.fromNestedJSON({
		[__dirname]: {},
		[__filename]: '...',
	}))
	beforeEach(() => clearCache())
	afterAll(() => vol.reset())

	it.for`
	version     | expected
	------------|---------
	${'8.22.0'} | ${false}
	${'8.23.0'} | ${false}
	${'8.23.1'} | ${false}
	${'8.24.0'} | ${false}
	${'9.0.0'}  | ${false}
	`('returns false without nextcloud/vue in dependencies', ({ version, expected }) => {
		const fn = createLibVersionValidator({
			cwd: '',
			physicalFilename: '/a/src/b.js',
		}, () => {
			throw new Error('not found', { cause: 'ERR_MODULE_NOT_FOUND' })
		})
		expect(fn(version)).toBe(expected)
	})

	it('works with physical filename', () => {
		vol.fromNestedJSON({
			'/a': {
				node_modules: {
					'@nextcloud': {
						vue: {
							'package.json': '{"version": "8.23.1"}',
						},
					},
				},
				src: {},
			},
		})
		const fn = createLibVersionValidator({
			cwd: '',
			physicalFilename: '/a/src/b.js',
		}, () => 'file:///a/node_modules/@nextcloud/vue/dist/index.js')
		expect(fn('8.22.0')).toBe(true)
		expect(fn('8.23.0')).toBe(true)
		expect(fn('8.23.1')).toBe(true)
		expect(fn('8.24.0')).toBe(false)
		expect(fn('9.0.0')).toBe(false)
	})

	it('works with cwd', () => {
		vol.fromNestedJSON({
			'/a': {
				node_modules: {
					'@nextcloud': {
						vue: {
							'package.json': '{"version": "8.23.1"}',
						},
					},
				},
				src: {},
			},
		})
		const fn = createLibVersionValidator({
			cwd: '/a',
			physicalFilename: 'src/b.js',
		}, () => 'file:///a/node_modules/@nextcloud/vue/dist/index.js')

		expect(fn('8.22.0')).toBe(true)
		expect(fn('8.23.0')).toBe(true)
		expect(fn('8.23.1')).toBe(true)
		expect(fn('8.24.0')).toBe(false)
		expect(fn('9.0.0')).toBe(false)
	})
})
