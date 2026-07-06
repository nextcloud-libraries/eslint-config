/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { fs, vol } from 'memfs'
import { findPackageJSON } from 'node:module'
import { beforeEach } from 'node:test'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { clearCache, createLibVersionValidator } from './lib-version-parser.ts'

vi.mock('node:fs', () => fs)
vi.mock('node:module', async (importOriginal) => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-imports
	const original = await importOriginal<typeof import('node:module')>()
	return {
		...original,
		findPackageJSON: vi.fn(),
	}
})

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
		vi.mocked(findPackageJSON).mockImplementation(() => {
			throw new Error("Cannot find package '@nextcloud/vue' imported from /a/src/b.js", { cause: 'ERR_MODULE_NOT_FOUND' })
		})
		const fn = createLibVersionValidator({
			cwd: '',
			physicalFilename: '/a/src/b.js',
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
		vi.mocked(findPackageJSON).mockReturnValue('/a/node_modules/@nextcloud/vue/package.json')
		const fn = createLibVersionValidator({
			cwd: '',
			physicalFilename: '/a/src/b.js',
		})
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
		vi.mocked(findPackageJSON).mockReturnValue('/a/node_modules/@nextcloud/vue/package.json')
		const fn = createLibVersionValidator({
			cwd: '/a',
			physicalFilename: 'src/b.js',
		})

		expect(fn('8.22.0')).toBe(true)
		expect(fn('8.23.0')).toBe(true)
		expect(fn('8.23.1')).toBe(true)
		expect(fn('8.24.0')).toBe(false)
		expect(fn('9.0.0')).toBe(false)
	})
})
