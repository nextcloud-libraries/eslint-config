/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { fs, vol } from 'memfs'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it, test, vi } from 'vitest'
import {
	isFile,
	sanitizeTargetVersion,
	findPackageJson,
	createLibVersionValidator,
} from './lib-version-parser.ts'

vi.mock('node:fs', () => fs)

describe('version-parser', () => {
	beforeAll(() => vol.fromNestedJSON({
		[__dirname]: {},
		[__filename]: '...',
	}))
	afterAll(() => vol.reset())

	test('isFile', () => {
		expect(isFile(__dirname)).toBe(false)
		expect(isFile(__filename)).toBe(true)
		expect(isFile(join(__dirname, 'does-not-exists.invalid'))).toBe(false)
	})

	test('sanitizeTargetVersion', () => {
		expect(sanitizeTargetVersion('^23.0.0')).toBe('23.0.0')
		expect(sanitizeTargetVersion('25.0')).toBe('25.0.0')
		expect(sanitizeTargetVersion('25.0.1')).toBe('25.0.1')

		try {
			const output = sanitizeTargetVersion('a.b.c')
			expect(output).toBe('Should not be reached')
		} catch (e) {
			expect(e.message).toMatch(/Invalid comparator/)
		}

		try {
			const output = sanitizeTargetVersion('25.0.0.1')
			expect(output).toBe('Should not be reached')
		} catch (e) {
			expect(e.message).toMatch(/Invalid comparator/)
		}
	})

	describe('findPackageJson', () => {
		afterEach(() => vol.reset())

		it('finds a package.json if provided', () => {
			vol.fromNestedJSON({
				'/a': {
					'package.json': '...',
					src: {},
				},
			})

			expect(findPackageJson('/a/src')).toBe('/a/package.json')
		})

		it('finds a package.json if provided on lower directory', () => {
			vol.fromNestedJSON({
				'/a': {
					'package.json': '...',
					src: {
						b: {
							c: {},
						},
					},
				},
			})

			expect(findPackageJson('/a/src/b/c')).toBe('/a/package.json')
		})

		it('returns undefined if not found', () => {
			vol.fromNestedJSON({
				'/a/src/b/c': {},
			})

			expect(findPackageJson('/a/src/b/c')).toBe(undefined)
		})

		it('required info.xml to exist', () => {
			vol.fromNestedJSON({
				'/a': {
					appinfo: { },
					src: { },
				},
			})

			expect(findPackageJson('/a/src')).toBe(undefined)
		})
	})

	describe('createLibVersionValidator', () => {
		it('static target version', () => {
			const fn = createLibVersionValidator({
				cwd: '',
				physicalFilename: '',
				options: [{ targetVersion: '8.23.0' }],
			})
			expect(fn('8.22.0')).toBe(true)
			expect(fn('8.23.0')).toBe(true)
			expect(fn('8.23.1')).toBe(false)
			expect(fn('8.24.0')).toBe(false)
			expect(fn('9.0.0')).toBe(false)
		})

		it('no config', () => {
			const fn = createLibVersionValidator({
				cwd: '',
				physicalFilename: '',
				options: [],
			})
			expect(fn('8.22.0')).toBe(false)
			expect(fn('8.23.0')).toBe(false)
			expect(fn('8.23.1')).toBe(false)
			expect(fn('8.24.0')).toBe(false)
			expect(fn('9.0.0')).toBe(false)
		})

		describe('app info', () => {
			afterEach(() => vol.reset())

			it('works with physical filename', () => {
				vol.fromNestedJSON({
					'/a': {
						'package.json': '{"name": "my-app","version": "0.1.0","dependencies":{"@nextcloud/vue":"^8.23.1"}}',
						src: { },
					},
				})
				const fn = createLibVersionValidator({
					cwd: '',
					physicalFilename: '/a/src/b.js',
					options: [{ parsePackageJson: true }],
				})
				expect(fn('8.22.0')).toBe(true)
				expect(fn('8.23.0')).toBe(true)
				expect(fn('8.23.1')).toBe(false)
				expect(fn('8.24.0')).toBe(false)
				expect(fn('9.0.0')).toBe(false)
			})

			it('works with cwd', () => {
				vol.fromNestedJSON({
					'/a': {
						'package.json': '{"name": "my-app","version": "0.1.0","dependencies":{"@nextcloud/vue":"^8.23.1"}}',
						src: { },
					},
				})
				const fn = createLibVersionValidator({
					cwd: '/a',
					physicalFilename: 'src/b.js',
					options: [{ parsePackageJson: true }],
				})
				expect(fn('8.22.0')).toBe(true)
				expect(fn('8.23.0')).toBe(true)
				expect(fn('8.23.1')).toBe(false)
				expect(fn('8.24.0')).toBe(false)
				expect(fn('9.0.0')).toBe(false)
			})

			it('throws error on missing max-version', () => {
				vol.fromNestedJSON({
					'/a': {
						'package.json': '{"name": "my-app","version": "0.1.0","dependencies":{"@nextcloud/l10n":"^2.2.0"}}',
						src: { },
					},
				})

				expect(() => createLibVersionValidator({
					cwd: '/a',
					physicalFilename: 'src/b.js',
					options: [{ parsePackageJson: true }],
				})).toThrowErrorMatchingInlineSnapshot('[Error: [@nextcloud/eslint-plugin] package.json does not contain a max-version (location: /a/package.json)]')
			})

			it('throws an error if appinfo was not found', () => {
				vol.fromNestedJSON({
					'/a': {
						src: { },
					},
				})

				expect(() => createLibVersionValidator({
					cwd: '/a',
					physicalFilename: 'src/b.js',
					options: [{ parsePackageJson: true }],
				})).toThrowErrorMatchingInlineSnapshot('[Error: [@nextcloud/eslint-plugin] package.json parsing was enabled, but no `package.json` was found.]')
			})
		})
	})
})
