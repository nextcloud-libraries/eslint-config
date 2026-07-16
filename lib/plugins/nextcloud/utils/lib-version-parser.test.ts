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

	it('matches the threshold for the installed major (9.x)', () => {
		vol.fromNestedJSON({
			'/b': {
				node_modules: { '@nextcloud': { vue: { 'package.json': '{"version": "9.1.0"}' } } },
				src: {},
			},
		})
		vi.mocked(findPackageJSON).mockReturnValue('/b/node_modules/@nextcloud/vue/package.json')
		const fn = createLibVersionValidator({ cwd: '', physicalFilename: '/b/src/b.js' })

		// 9.1.0 is compared against the 9.x threshold, not the backported 8.x one
		expect(fn('8.34.0', '9.2.0')).toBe(false) // deprecated on main only from 9.2.0
		expect(fn('8.34.0', '9.0.0')).toBe(true)
		expect(fn('9.1.0')).toBe(true)
		expect(fn('9.2.0')).toBe(false)
		// a lone 8.x threshold still applies to a 9.x install (feature removed in v9)
		expect(fn('8.24.0')).toBe(true)
		// a threshold from a newer major than installed is never satisfied
		expect(fn('10.0.0')).toBe(false)
	})

	it('matches the threshold for the installed major (8.x)', () => {
		vol.fromNestedJSON({
			'/c': {
				node_modules: { '@nextcloud': { vue: { 'package.json': '{"version": "8.35.0"}' } } },
				src: {},
			},
		})
		vi.mocked(findPackageJSON).mockReturnValue('/c/node_modules/@nextcloud/vue/package.json')
		const fn = createLibVersionValidator({ cwd: '', physicalFilename: '/c/src/b.js' })

		// 8.35.0 is compared against the 8.x threshold, ignoring the 9.x one
		expect(fn('8.34.0', '9.2.0')).toBe(true)
		expect(fn('8.36.0', '9.0.0')).toBe(false)
	})
})
