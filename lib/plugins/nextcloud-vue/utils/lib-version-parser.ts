/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { lstatSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, resolve, sep } from 'node:path'
import { gte, minVersion, valid } from 'semver'

/**
 * Cached map of paths: Reco <path_to_package.json, validator>
 */
const cachedMap: Record<string, (version: string) => boolean> = {}

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
 * @return Either the full path where `package.json` is located or `undefined` if no found
 */
export function findPackageJsonDir(currentPath: string): string | undefined {
	for (const cachedDirPath of Object.keys(cachedMap)) {
		if (currentPath.startsWith(cachedDirPath)) {
			return cachedDirPath
		}
	}
	while (currentPath && currentPath !== sep) {
		if (isFile(join(currentPath, 'package.json'))) {
			return currentPath
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
 * @return Function validator, return a boolean whether current version satisfies minimal required for the rule
 */
export function createLibVersionValidator({ cwd, physicalFilename }): ((version: string) => boolean) {
	// Try to find package.json and parse the supported version
	// Current working directory, either the filename (can be empty) or the cwd property
	const currentDirectory = isAbsolute(physicalFilename)
		? resolve(dirname(physicalFilename))
		: dirname(resolve(cwd, physicalFilename))

	// The nearest package.json
	const packageJsonDir = findPackageJsonDir(currentDirectory)
	if (!packageJsonDir) {
		// Skip the rule
		return () => false
	} else if (cachedMap[packageJsonDir]) {
		return cachedMap[packageJsonDir]
	}

	const json = JSON.parse(readFileSync(join(packageJsonDir, 'package.json'), 'utf-8'))
	const libVersions = [
		json?.dependencies?.['@nextcloud/vue'],
		json?.devDependencies?.['@nextcloud/vue'],
		json?.peerDependencies?.['@nextcloud/vue'],
	]
		.filter((version) => typeof version === 'string' && !!version)
		.map(sanitizeTargetVersion)
		.sort((a, b) => gte(a, b) ? 1 : -1)

	if (!libVersions.length) {
		// Skip the rule
		return () => false
	}

	// Return, whether given version satisfies minimal version from dependencies
	return (version: string) => gte(libVersions[0], version)
}
