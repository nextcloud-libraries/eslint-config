/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

export default {
	meta: {
		fixable: 'code',
		type: 'layout',
		schema: [],
		docs: {
			description: 'Enforce a copyright header comments to use the legal comment `/*!` format instead of `/**` or `/*`',
		},
		messages: {
			wrongCommentFormat: 'Copyright header must use the legal comment format `/*!`, not {{ format }}',
			missingEmptyLine: 'Copyright header must be followed by an empty line',
		},
	},

	create(context) {
		const sourceCode = context.sourceCode

		return {
			Program(node) {
				// Only consider block comments before any code (e.g. after a shebang or eslint directives)
				const firstToken = sourceCode.getFirstToken(node)
				const comment = sourceCode.getAllComments()
					.filter((comment) => comment.type === 'Block')
					.filter((comment) => !firstToken || comment.range![1] <= firstToken.range[0])
					// Only check if it's actually a copyright comment
					.find((comment) => comment.value.toLowerCase().includes('copyright'))

				if (!comment) {
					return
				}

				const commentText = sourceCode.getText(comment as unknown as Rule.Node)
				const commentStart = commentText.match(/^\/\*[^\s]*/)![0]

				// Check for correct /*! comment format
				if (commentStart !== '/*!') {
					context.report({
						loc: comment.loc!,
						messageId: 'wrongCommentFormat',
						data: { format: commentStart },
						fix(fixer) {
							return fixer.replaceTextRange(
								[comment.range![0], comment.range![0] + commentStart.length],
								'/*!',
							)
						},
					})
				}

				// Check for empty line after copyright comment
				const commentEnd = comment.range![1]
				const textAfterComment = sourceCode.getText().slice(commentEnd, commentEnd + 2)
				if (textAfterComment !== '\n\n') {
					context.report({
						loc: comment.loc!,
						messageId: 'missingEmptyLine',
						fix(fixer) {
							return fixer.insertTextAfterRange([commentEnd, commentEnd], '\n')
						},
					})
				}
			},
		}
	},
} satisfies Rule.RuleModule
