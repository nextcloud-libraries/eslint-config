/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { lstatSync, readFileSync } from 'node:fs'
import { sep, resolve, isAbsolute, dirname } from 'node:path'
import { valid, minVersion, lte } from 'semver'

/**
 * Check if a given path exists and is a file
 *
 * @param filePath The path
 */
export function isFile(filePath: string): boolean {
	const stats = lstatSync(filePath, { throwIfNoEntry: false })
	return stats !== undefined && stats.isFile()
}

/**
 * Find the path of nearest `package.json` relative to given path
 *
 * @param currentPath Path to lookup
 * @return Either the full path including the `package.json` part or `undefined` if no found
 */
export function findPackageJson(currentPath: string): string | undefined {
	while (currentPath && currentPath !== sep) {
		const packageJsonPath = `${currentPath}${sep}package.json`
		if (
			isFile(packageJsonPath)
		) {
			return packageJsonPath
		}
		currentPath = resolve(currentPath, '..')
	}
	return undefined
}

/**
 * Make sure that versions like '25' can be handled by semver
 *
 * @param version The pure version string
 * @return Sanitized version string
 */
export function sanitizeTargetVersion(version: string): string {
	const sanitizedVersion = minVersion(version)?.version
	// now version should look like '23.0.0'
	if (!valid(sanitizedVersion)) {
		throw Error(`[@nextcloud/eslint-plugin] Invalid target version ${version} found`)
	}
	return sanitizedVersion
}

/**
 * Create a callback that takes a version number and checks if the version
 * is valid compared to configured version / detected version.
 *
 * @param options Options
 * @param options.cwd The current working directory
 * @param options.physicalFilename The real filename where ESLint is linting currently
 * @param options.options The plugin options
 */
export function createLibVersionValidator({ cwd, physicalFilename, options }): ((version: string) => boolean) {
	const settings = options[0]

	if (settings?.targetVersion) {
		// check if the rule version is lower than the current target version
		const maxVersion = sanitizeTargetVersion(settings.targetVersion)
		return (version) => lte(version, maxVersion)
	}

	// Try to find package.json and parse the supported version
	if (settings?.parsePackageJson !== false) {
		// Current working directory, either the filename (can be empty) or the cwd property
		const currentDirectory = isAbsolute(physicalFilename)
			? resolve(dirname(physicalFilename))
			: dirname(resolve(cwd, physicalFilename))

		// The nearest package.json
		const packageJsonPath = findPackageJson(currentDirectory)
		if (packageJsonPath) {
			const json = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
			let maxVersion = json?.dependencies?.['@nextcloud/vue']
			if (typeof maxVersion !== 'string') {
				throw new Error(`[@nextcloud/eslint-plugin] package.json does not contain a max-version (location: ${packageJsonPath})`)
			}
			maxVersion = sanitizeTargetVersion(maxVersion)
			return (version) => lte(version, maxVersion)
		}

		if (settings?.parsePackageJson === true) {
			// User enforced app info parsing, so we throw an error - otherwise just fallback to default
			throw new Error('[@nextcloud/eslint-plugin] package.json parsing was enabled, but no `package.json` was found.')
		}
	}

	// If not configured or parsing is disabled, every rule should be handled
	return () => false
}
