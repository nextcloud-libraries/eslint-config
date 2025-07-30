/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'

import { createLibVersionValidator } from '../utils/lib-version-parser.ts'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/*
 Introduced in @nextcloud/vue v8.23.0
 https://github.com/nextcloud-libraries/nextcloud-vue/pull/6385
 */

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			description: 'Deprecated @nextcloud/vue import syntax',
			recommended: true,
		},
		fixable: 'code',
		messages: {
			outdatedVueLibrary: 'Installed @nextcloud/vue library is outdated and does not support all reported errors. Install latest compatible version',
			deprecatedDist: 'Import from "@nextcloud/vue/dist" is deprecated',
		},
	},

	create(context) {
		const versionSatisfies = createLibVersionValidator(context)
		const isVersionValid = versionSatisfies('8.23.0')

		const oldPattern = '@nextcloud/vue/dist/([^/]+)/([^/.]+)'

		return {
			ImportDeclaration: function(node) {
				const importPath = node.source.value as string
				const match = importPath.match(new RegExp(oldPattern))

				if (match) {
					if (!isVersionValid) {
						context.report({ node, messageId: 'outdatedVueLibrary' })
						return
					}

					const newImportPath = `'@nextcloud/vue/${match[1].toLowerCase()}/${match[2]}'`
					context.report({
						node,
						messageId: 'deprecatedDist',
						fix(fixer) {
							return fixer.replaceText(node.source, newImportPath)
						},
					})
				}
			},
		}
	},
}

export default rule
