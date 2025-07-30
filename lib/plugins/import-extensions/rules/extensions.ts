/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'
import type { Literal } from 'estree'
import type { Dirent } from 'fs'

import { existsSync, opendirSync, statSync } from 'fs'
import { basename, dirname, extname, join, resolve } from 'path'

// we use this module scope map to cache results for resolving the file extensions
// in larger projects its likely the same files are imported so we cache "absolute resolved import without extension" -> array of possible extensions
const fsCache = new Map<string, string[]>()

/**
 * helper for unit tests
 */
export function clearCache() {
	fsCache.clear()
}

export const rule: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description: 'Ensure all relative imports and exports have a file extension',
		},
		messages: {
			missingExtension: 'This relative {{ type }} should have a file extension.',
			recommendedMissingExtension: 'The relative {{ type }} should probably have the file extension "{{ extension }}".',
			applySuggestedExtension: 'Add the "{{ extension }}" to the {{ type }}.',
		},
	},

	create(context) {
		/**
		 * @param node - The ESTree node representing the source
		 * @param isImport - is this an import or export
		 */
		function handleImportExport(node: Literal, isImport = true) {
			const value = String(node.value)
			if (!value.includes('/')) {
				return
			}

			// get rid of query like ?raw
			const [text] = value.split('?', 2)
			if (text.match(/\.[a-z0-9]+$/i)) {
				return
			}

			const type = isImport ? 'import' : 'export'
			// check custom paths - we cannot fix though
			if (text.startsWith('~/')) {
				context.report({
					node,
					messageId: 'missingExtension',
					data: { type },
				})
			}

			if (!text.match(/^\.\.?\//)) {
				return
			}

			const contextPath = dirname(context.physicalFilename)
			const relativePath = resolve(contextPath, text)
			const absolutePath = resolve(context.cwd, relativePath)
			if (!fsCache.has(absolutePath)) {
				let resolvedPath = relativePath
				if (existsSync(resolvedPath)) {
					if (statSync(resolvedPath).isDirectory) {
						resolvedPath = join(resolvedPath, 'index')
					} else {
						// weird extensionless file
						return
					}
				}

				const resolvedDirectoryPath = dirname(resolvedPath)
				if (existsSync(resolvedDirectoryPath)) {
					const filename = basename(resolvedPath)
					const resolvedDir = opendirSync(resolvedDirectoryPath)

					const extensions = []
					try {
						let entry: Dirent
						while ((entry = resolvedDir.readSync()) !== null) {
							const extension = extname(entry.name)
							if (extension && `${filename}${extension}` === entry.name) {
								extensions.push(extension)
							}
						}
					} finally {
						resolvedDir.close()
					}
					fsCache.set(absolutePath, extensions)
				}
			}

			if (fsCache.get(absolutePath)?.length) {
				return context.report({
					node,
					messageId: fsCache.get(absolutePath).length === 1
						? 'recommendedMissingExtension'
						: 'missingExtension',
					data: {
						extension: fsCache.get(absolutePath)[0],
						type,
					},
					suggest: fsCache.get(absolutePath).map((extension) => ({
						messageId: 'applySuggestedExtension',
						data: {
							extension,
							type,
						},
						fix(fixer) {
							const range: [number, number] = [node.range![0], node.range![0] + 1 + text.length]
							return fixer.insertTextAfterRange(range, extension)
						},
					})),
				})
			}

			// no way to fix it
			context.report({
				node,
				messageId: 'missingExtension',
				data: {
					type,
				},
			})
		}

		return {
			ExportAllDeclaration(node) {
				handleImportExport(node.source, false)
			},
			ExportNamedDeclaration(node) {
				if (node.source) {
					handleImportExport(node.source, false)
				}
			},
			ImportDeclaration(node) {
				handleImportExport(node.source)
			},
			ImportExpression(node) {
				if (node.source.type === 'Literal') {
					handleImportExport(node.source)
				}
				// we cannot handle dynamic imports here
			},
		}
	},
}

export default rule
