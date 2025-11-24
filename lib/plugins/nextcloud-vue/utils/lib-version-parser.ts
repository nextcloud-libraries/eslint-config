/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { readFileSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
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
 * @param importResolve Optional custom import resolver function (for testing purposes)
 * @return Function validator, return a boolean whether current version satisfies minimal required for the rule
 */
export function createLibVersionValidator({ cwd, physicalFilename }, importResolve = import.meta.resolve): ((version: string) => boolean) {
	// Try to find package.json of the nextcloud-vue package
	const sourceFile = isAbsolute(physicalFilename)
		? resolve(physicalFilename)
		: resolve(cwd, physicalFilename)

	let packageJsonDir: string
	try {
		const modulePath = fileURLToPath(importResolve('@nextcloud/vue', pathToFileURL(sourceFile)))
		const idx = modulePath.lastIndexOf('/dist/')
		packageJsonDir = modulePath.substring(0, idx)
	} catch {
		return () => false
	}

	if (!cachedMap[packageJsonDir]) {
		const json = JSON.parse(readFileSync(join(packageJsonDir, 'package.json'), 'utf-8'))
		const libVersion = json.version
		cachedMap[packageJsonDir] = (version: string) => gte(libVersion, version)
	}

	return cachedMap[packageJsonDir]
}

/**
 * Clear the module cache
 */
export function clearCache() {
	cachedMap.clear()
}
