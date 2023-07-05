const path = require('node:path')
const utils = require('../../../lib/utils/version-parser.js')
const { vol } = require('memfs')

jest.mock('node:fs')

describe('version-parser', () => {
	beforeAll(() => vol.fromJSON({ [__dirname]: {}, [__filename]: '...'}))
	afterAll(() => vol.reset())

	test('isDirectory', () => {
		expect(utils.isDirectory(__dirname)).toBe(true)
		expect(utils.isDirectory(__filename)).toBe(false)
		expect(utils.isDirectory(path.join(__dirname, 'does-not-exists.invalid'))).toBe(false)
	})

	test('isFile', () => {
		expect(utils.isFile(__dirname)).toBe(false)
		expect(utils.isFile(__filename)).toBe(true)
		expect(utils.isFile(path.join(__dirname, 'does-not-exists.invalid'))).toBe(false)
	})

	test('sanitizeTargetVersion', () => {
		expect(utils.sanitizeTargetVersion('25')).toBe('25.0.0')
		expect(utils.sanitizeTargetVersion('25.0')).toBe('25.0.0')
		expect(utils.sanitizeTargetVersion('25.0.1')).toBe('25.0.1')

		try {
			const output = utils.sanitizeTargetVersion('a.b.c')
			expect(output).toBe('Should not be reached')
		} catch (e) {
			expect(e.message).toMatch(/Invalid target version/)
		}

		try {
			const output = utils.sanitizeTargetVersion('25.0.0.1')
			expect(output).toBe('Should not be reached')
		} catch (e) {
			expect(e.message).toMatch(/Invalid target version/)
		}
	})

	describe('findAppinfo', () => {
		afterEach(() => vol.reset())
		
		it('finds an appinfo if provided', () => {
			vol.fromNestedJSON(
				{
					'/a': {
						appinfo: {
							'info.xml': '...',
						},
						src: {},
					},
				},
			)

			expect(utils.findAppinfo('/a/src')).toBe('/a/appinfo/info.xml')
		})

		it('finds an appinfo if provided on lower directory', () => {
			vol.fromNestedJSON(
				{
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
				},
			)

			expect(utils.findAppinfo('/a/src/b/c')).toBe('/a/appinfo/info.xml')
		})

		it('returns undefined if not found', () => {
			vol.fromNestedJSON(
				{
					'/a/src/b/c': {},
				},
			)

			expect(utils.findAppinfo('/a/src/b/c')).toBe(undefined)
		})

		it('required info.xml to exist', () => {
			vol.fromNestedJSON({
				'/a': { 
					'appinfo': { },
					'src': { },
				}
			})

			expect(utils.findAppinfo('/a/src')).toBe(undefined)
		})
	})

	describe('createVersionValidator', () => {
		it('static target version', () => {
			const fn = utils.createVersionValidator({ cwd: '', physicalFilename: '', options: [{ targetVersion: '25.0.0' }] })
			expect(fn('26.0.0')).toBe(false)
			expect(fn('25.0.1')).toBe(false)
			expect(fn('25.0.0')).toBe(true)
			expect(fn('24.0.0')).toBe(true)
		})

		it('no config', () => {
			const fn = utils.createVersionValidator({ cwd: '', physicalFilename: '', options: [] })
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
				const fn = utils.createVersionValidator({ cwd: '', physicalFilename: '/a/src/b.js', options: [{ parseAppInfo: true }] })
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
				const fn = utils.createVersionValidator({ cwd: '/a', physicalFilename: 'src/b.js', options: [{ parseAppInfo: true }] })
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
				try {
					const fn = utils.createVersionValidator({ cwd: '/a', physicalFilename: 'src/b.js', options: [{ parseAppInfo: true }] })
					expect(typeof fn).beBe('Should not be reached')
				} catch (e) {
					expect(e.message).toMatch('AppInfo does not contain a max-version')
				}
			})

			it('throws an error if appinfo was not found', () => {
				vol.fromNestedJSON({
					'/a': {
						appinfo: { },
						src: { },
					},
				})
				try {
					const fn = utils.createVersionValidator({ cwd: '/a', physicalFilename: 'src/b.js', options: [{ parseAppInfo: true }] })
					expect(typeof fn).beBe('Should not be reached')
				} catch (e) {
					expect(e.message).toMatch('AppInfo parsing was enabled, but no `appinfo/info.xml` was found')
				}
			})
		})
	})
})
