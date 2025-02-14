import { XMLParser } from 'fast-xml-parser'
import { lstatSync, readFileSync } from 'node:fs'
import { sep, resolve, isAbsolute, dirname } from 'node:path'
import { valid, lte } from 'semver'

/**
 * Check if a given path exists and is a directory
 *
 * @param {string} filePath The path
 * @return {boolean}
 */
export function isDirectory(filePath: string): boolean {
	const stats = lstatSync(filePath, { throwIfNoEntry: false })
	return stats !== undefined && stats.isDirectory()
}

/**
 * Check if a given path exists and is a directory
 *
 * @param {string} filePath The path
 * @return {boolean}
 */
export function isFile(filePath: string): boolean {
	const stats = lstatSync(filePath, { throwIfNoEntry: false })
	return stats !== undefined && stats.isFile()
}

/**
 * Find the path of nearest `appinfo/info.xml` relative to given path
 *
 * @param {string} currentPath
 * @return {string|undefined} Either the full path including the `info.xml` part or `undefined` if no found
 */
export function findAppinfo(currentPath: string): string|undefined {
	while (currentPath && currentPath !== sep) {
		const appinfoPath = `${currentPath}${sep}appinfo`
		if (
			isDirectory(appinfoPath) &&
			isFile(`${appinfoPath}${sep}info.xml`)
		) {
			return `${appinfoPath}${sep}info.xml`
		}
		currentPath = resolve(currentPath, '..')
	}
	return undefined
}

/**
 * Make sure that versions like '25' can be handled by semver
 *
 * @param {string} version The pure version string
 * @return {string} Sanitized version string
 */
export function sanitizeTargetVersion(version: string): string {
	let sanitizedVersion = version
	const sections = sanitizedVersion.split('.').length
	if (sections < 3) {
		sanitizedVersion = sanitizedVersion + '.0'.repeat(3 - sections)
	}
	// now version should look like '25.0.0'
	if (!valid(sanitizedVersion)) {
		throw Error(
			`[@nextcloud/eslint-plugin] Invalid target version ${version} found`,
		)
	}
	return sanitizedVersion
}

export function createVersionValidator({ cwd, physicalFilename, options }) {
	const settings = options[0]

	if (settings?.targetVersion) {
		// check if the rule version is lower than the current target version
		const maxVersion = sanitizeTargetVersion(settings.targetVersion)
		return (version) => lte(version, maxVersion)
	}

	// Try to find appinfo and parse the supported version
	if (settings?.parseAppInfo !== false) {
		// Current working directory, either the filename (can be empty) or the cwd property
		const currentDirectory = isAbsolute(physicalFilename)
			? resolve(dirname(physicalFilename))
			: dirname(resolve(cwd, physicalFilename))

		// The nearest appinfo
		const appinfoPath = findAppinfo(currentDirectory)
		if (appinfoPath) {
			const parser = new XMLParser({
				attributeNamePrefix: '@',
				ignoreAttributes: false,
			})
			const xml = parser.parse(readFileSync(appinfoPath))
			let maxVersion = xml?.info?.dependencies?.nextcloud?.['@max-version']
			if (typeof maxVersion !== 'string') {
				throw new Error(
					`[@nextcloud/eslint-plugin] AppInfo does not contain a max-version (location: ${appinfoPath})`,
				)
			}
			maxVersion = sanitizeTargetVersion(maxVersion)
			return (version) => lte(version, maxVersion)
		}

		if (settings?.parseAppInfo === true) {
			// User enforced app info parsing, so we throw an error - otherwise just fallback to default
			throw new Error(
				'[@nextcloud/eslint-plugin] AppInfo parsing was enabled, but no `appinfo/info.xml` was found.',
			)
		}
	}

	// If not configured or parsing is disabled, every rule should be handled
	return () => true
}
