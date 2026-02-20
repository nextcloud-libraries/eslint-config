/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import { fs, vol } from 'memfs'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it, test, vi } from 'vitest'
import {
	createVersionValidator,
	findAppinfo,
	isDirectory,
	isFile,
	sanitizeTargetVersion,
} from './app-version-parser.ts'

vi.mock('node:fs', () => fs)

describe('version-parser', () => {
	beforeAll(() => vol.fromNestedJSON({
		[__dirname]: {},
		[__filename]: '...',
	}))
	afterAll(() => vol.reset())

	test('isDirectory', () => {
		expect(isDirectory(__dirname)).toBe(true)
		expect(isDirectory(__filename)).toBe(false)
		expect(isDirectory(join(__dirname, 'does-not-exists.invalid'))).toBe(false)
	})

	test('isFile', () => {
		expect(isFile(__dirname)).toBe(false)
		expect(isFile(__filename)).toBe(true)
		expect(isFile(join(__dirname, 'does-not-exists.invalid'))).toBe(false)
	})

	test('sanitizeTargetVersion', () => {
		expect(sanitizeTargetVersion('25')).toBe('25.0.0')
		expect(sanitizeTargetVersion('25.0')).toBe('25.0.0')
		expect(sanitizeTargetVersion('25.0.1')).toBe('25.0.1')

		try {
			const output = sanitizeTargetVersion('a.b.c')
			expect(output).toBe('Should not be reached')
		} catch (e) {
			expect((e as any).message).toMatch(/Invalid target version/)
		}

		try {
			const output = sanitizeTargetVersion('25.0.0.1')
			expect(output).toBe('Should not be reached')
		} catch (e) {
			expect((e as any).message).toMatch(/Invalid target version/)
		}
	})

	describe('findAppinfo', () => {
		afterEach(() => vol.reset())

		it('finds an appinfo if provided', () => {
			vol.fromNestedJSON({
				'/a': {
					appinfo: {
						'info.xml': '...',
					},
					src: {},
				},
			})

			expect(findAppinfo('/a/src')).toBe('/a/appinfo/info.xml')
		})

		it('finds an appinfo if provided on lower directory', () => {
			vol.fromNestedJSON({
				'/a': {
					appinfo: {
						'info.xml': '...',
					},
					src: {
						b: {
							c: {},
						},
					},
				},
			})

			expect(findAppinfo('/a/src/b/c')).toBe('/a/appinfo/info.xml')
		})

		it('returns undefined if not found', () => {
			vol.fromNestedJSON({
				'/a/src/b/c': {},
			})

			expect(findAppinfo('/a/src/b/c')).toBe(undefined)
		})

		it('required info.xml to exist', () => {
			vol.fromNestedJSON({
				'/a': {
					appinfo: { },
					src: { },
				},
			})

			expect(findAppinfo('/a/src')).toBe(undefined)
		})
	})

	describe('createVersionValidator', () => {
		it('static target version', () => {
			const fn = createVersionValidator({
				cwd: '',
				physicalFilename: '',
				options: [{ targetVersion: '25.0.0' }],
			} as Rule.RuleContext)
			expect(fn('26.0.0')).toBe(false)
			expect(fn('25.0.1')).toBe(false)
			expect(fn('25.0.0')).toBe(true)
			expect(fn('24.0.0')).toBe(true)
		})

		it('no config', () => {
			const fn = createVersionValidator({
				cwd: '',
				physicalFilename: '',
				options: [],
			} as unknown as Rule.RuleContext)
			expect(fn('26.0.0')).toBe(true)
			expect(fn('25.0.1')).toBe(true)
			expect(fn('25.0.0')).toBe(true)
			expect(fn('24.0.0')).toBe(true)
		})

		describe('app info', () => {
			afterEach(() => vol.reset())

			it('works with physical filename', () => {
				vol.fromNestedJSON({
					'/a': {
						appinfo: {
							'info.xml': '<info><dependencies><nextcloud min-version="26" max-version="27" /></dependencies></info>',
						},
						src: { },
					},
				})
				const fn = createVersionValidator({
					cwd: '',
					physicalFilename: '/a/src/b.js',
					options: [{ parseAppInfo: true }],
				} as Rule.RuleContext)
				expect(fn('28.0.0')).toBe(false)
				expect(fn('27.0.0')).toBe(true)
				expect(fn('26.0.0')).toBe(true)
				expect(fn('25.0.0')).toBe(true)
			})

			it('works with cwd', () => {
				vol.fromNestedJSON({
					'/a': {
						appinfo: {
							'info.xml': '<info><dependencies><nextcloud min-version="26" max-version="27" /></dependencies></info>',
						},
						src: { },
					},
				})
				const fn = createVersionValidator({
					cwd: '/a',
					physicalFilename: 'src/b.js',
					options: [{ parseAppInfo: true }],
				} as Rule.RuleContext)
				expect(fn('28.0.0')).toBe(false)
				expect(fn('27.0.0')).toBe(true)
				expect(fn('26.0.0')).toBe(true)
				expect(fn('25.0.0')).toBe(true)
			})

			it('throws error on missing max-version', () => {
				vol.fromNestedJSON({
					'/a': {
						appinfo: {
							'info.xml': '<info><dependencies><nextcloud min-version="26" /></dependencies></info>',
						},
						src: { },
					},
				})

				expect(() => createVersionValidator({
					cwd: '/a',
					physicalFilename: 'src/b.js',
					options: [{ parseAppInfo: true }],
				} as Rule.RuleContext)).toThrowErrorMatchingInlineSnapshot('[Error: [@nextcloud/eslint-plugin] AppInfo does not contain a max-version (location: /a/appinfo/info.xml)]')
			})

			it('throws an error if appinfo was not found', () => {
				vol.fromNestedJSON({
					'/a': {
						appinfo: { },
						src: { },
					},
				})

				expect(() => createVersionValidator({
					cwd: '/a',
					physicalFilename: 'src/b.js',
					options: [{ parseAppInfo: true }],
				} as Rule.RuleContext)).toThrowErrorMatchingInlineSnapshot('[Error: [@nextcloud/eslint-plugin] AppInfo parsing was enabled, but no `appinfo/info.xml` was found.]')
			})
		})
	})
})
