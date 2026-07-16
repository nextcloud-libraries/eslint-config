/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { readFileSync } from 'node:fs'
import { findPackageJSON } from 'node:module'
import { isAbsolute, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { compare, gte, major } from 'semver'

/**
 * Cached map of paths: Reco <path_to_package.json, validator>
 */
const cachedMap = new Map<string, (...versions: string[]) => boolean>()

/**
 * Create a callback that checks whether the installed library version satisfies
 * a minimal required version.
 *
 * The validator accepts one threshold per major release line, e.g.
 * `versionSatisfies('8.34.0', '9.2.0')` for a deprecation that was backported to
 * stable8 in 8.34.0 and landed on main in 9.2.0. The installed version is
 * compared against the threshold matching its own major (falling back to the
 * highest threshold from an earlier major), so a 9.0.0 installation is not flagged by
 * a deprecation that only exists from 9.2.0 onwards.
 *
 * @param options Options
 * @param options.cwd The current working directory
 * @param options.physicalFilename The real filename where ESLint is linting currently
 * @return Function validator, return a boolean whether current version satisfies minimal required for the rule
 */
export function createLibVersionValidator({ cwd, physicalFilename }: { cwd: string, physicalFilename: string }): ((...versions: string[]) => boolean) {
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
		cachedMap.set(packageJsonPath, (...versions: string[]) => {
			// Pick the threshold for the installed major (or the highest from an
			// earlier major), then check the installed version against it.
			const [threshold] = versions
				.filter((version) => major(version) <= major(libVersion))
				.sort((a, b) => compare(b, a))
			return threshold !== undefined && gte(libVersion, threshold)
		})
	}

	return cachedMap.get(packageJsonPath)!
}

/**
 * Clear the module cache
 */
export function clearCache() {
	cachedMap.clear()
}
