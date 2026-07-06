/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { readFileSync } from 'node:fs'
import { findPackageJSON } from 'node:module'
import { isAbsolute, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { gte } from 'semver'

/**
 * Cached map of paths: Reco <path_to_package.json, validator>
 */
const cachedMap = new Map<string, (version: string) => boolean>()

/**
 * Create a callback that takes a version number and checks if the version
 * is valid compared to configured version / detected version.
 *
 * @param options Options
 * @param options.cwd The current working directory
 * @param options.physicalFilename The real filename where ESLint is linting currently
 * @return Function validator, return a boolean whether current version satisfies minimal required for the rule
 */
export function createLibVersionValidator({ cwd, physicalFilename }: { cwd: string, physicalFilename: string }): ((version: string) => boolean) {
	// Try to find package.json of the nextcloud-vue package
	const sourceFile = isAbsolute(physicalFilename)
		? resolve(physicalFilename)
		: resolve(cwd, physicalFilename)

	let packageJsonPath: string | undefined
	try {
		packageJsonPath = findPackageJSON('@nextcloud/vue', pathToFileURL(sourceFile))
	} catch {
		packageJsonPath = undefined
	}

	if (!packageJsonPath) {
		return () => false
	}

	if (!cachedMap.has(packageJsonPath)) {
		const json = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
		const libVersion = json.version
		cachedMap.set(packageJsonPath, (version: string) => gte(libVersion, version))
	}

	return cachedMap.get(packageJsonPath)!
}

/**
 * Clear the module cache
 */
export function clearCache() {
	cachedMap.clear()
}
