/*!
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-FileCopyrightText: 2015 Ben Mosher
 * SPDX-License-Identifier: MIT
 */

import type { TSESTree } from '@typescript-eslint/types'
import type { AST, Rule, SourceCode } from 'eslint'
import type * as ESTree from 'estree'

export const rule: Rule.RuleModule = {
	meta: {
		fixable: 'code',
		type: 'suggestion',
		docs: {
			dialects: ['typescript'],
			description: 'Ban the use of inline type-only markers for named imports.',
		},
		messages: {
			preferTopLevel: 'Prefer using a top-level type-only import instead of inline type specifiers.',
		},
	},

	create(context) {
		return {
			ImportDeclaration(node: ESTree.ImportDeclaration | TSESTree.ImportDeclaration) {
				if (
					!('importKind' in node)
					|| node.importKind === 'type'
					// no specifiers (import {} from '') cannot have inline - so is valid
					|| node.specifiers.length === 0
					|| (
						node.specifiers.length === 1
						// default imports are both "inline" and "top-level"
						&& (
							node.specifiers[0].type === 'ImportDefaultSpecifier'
							// namespace imports are both "inline" and "top-level"
							|| node.specifiers[0].type === 'ImportNamespaceSpecifier'
						)
					)
				) {
					return
				}

				const typeSpecifiers: TSESTree.ImportSpecifier[] = []
				const valueSpecifiers: TSESTree.ImportClause[] = []
				let defaultSpecifier: TSESTree.ImportDefaultSpecifier
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportDefaultSpecifier') {
						defaultSpecifier = specifier
						continue
					}

					if (!('importKind' in specifier) || !specifier.importKind) {
						valueSpecifiers.push(specifier)
						continue
					}

					if (specifier.importKind === 'type') {
						typeSpecifiers.push(specifier)
					} else if (specifier.importKind === 'value') {
						valueSpecifiers.push(specifier)
					}
				}

				const typeImport = getImportText(node, context.sourceCode, typeSpecifiers)
				const newImports = typeImport.trim()

				if (typeSpecifiers.length === node.specifiers.length) {
					// all specifiers have inline specifiers - so we replace the entire import
					context.report({
						node,
						messageId: 'preferTopLevel',
						fix(fixer) {
							return fixer.replaceText(node, newImports)
						},
					})
				} else {
					// remove specific specifiers and insert new imports for them
					for (const specifier of typeSpecifiers) {
						context.report({
							node: specifier,
							messageId: 'preferTopLevel',
							fix(fixer) {
								const fixes: Rule.Fix[] = []

								// if there are no value specifiers, then the other report fixer will be called, not this one
								if (valueSpecifiers.length > 0) {
									// import { Value, type Type } from 'mod';

									// we can just remove the type specifiers
									removeSpecifiers(fixes, fixer, context.sourceCode, typeSpecifiers)

									// make the import nicely formatted by also removing the trailing comma after the last value import
									// eg
									// import { Value, type Type } from 'mod';
									// to
									// import { Value  } from 'mod';
									// not
									// import { Value,  } from 'mod';
									removeCommaAfterNode(fixes, fixer, context.sourceCode, valueSpecifiers[valueSpecifiers.length - 1])
								} else if (defaultSpecifier) {
									// import Default, { type Type } from 'mod';

									// remove the entire curly block so we don't leave an empty one behind
									// NOTE - the default specifier *must* be the first specifier always!
									//        so a comma exists that we also have to clean up or else it's bad syntax
									const comma = context.sourceCode.getTokenAfter(defaultSpecifier, isComma)
									const closingBrace = context.sourceCode.getTokenAfter(
										node.specifiers[node.specifiers.length - 1],
										(token) => token.type === 'Punctuator' && token.value === '}',
									)
									if (comma && closingBrace) {
										fixes.push(fixer.removeRange([
											comma.range[0],
											closingBrace.range[1],
										]))
									}
								}

								// insert the new imports after the old declaration
								return fixes.concat(fixer.insertTextAfter(node, `\n${newImports}`))
							},
						})
					}
				}
			},
		}
	},
}

/**
 * Check if the given token is a comma
 *
 * @param token - The token to check
 */
function isComma(token: TSESTree.Token | AST.Token): boolean {
	return token.type === 'Punctuator' && token.value === ','
}

/**
 * Remove the given specifiers from the import declaration, along with any trailing commas if necessary.
 *
 * @param fixes - The array to which the generated fixes will be added
 * @param fixer - The fixer object used to create the fixes
 * @param sourceCode - The source code object used to analyze the code and find tokens
 * @param specifiers - The specifiers to remove from the import declaration
 */
function removeSpecifiers(fixes: Rule.Fix[], fixer: Rule.RuleFixer, sourceCode: SourceCode, specifiers: TSESTree.ImportClause[]) {
	for (const specifier of specifiers) {
		removeCommaAfterNode(fixes, fixer, sourceCode, specifier)
		fixes.push(fixer.remove(specifier))
	}
}

/**
 * Remove the trailing comma
 *
 * @param fixes - The array to which the generated fixes will be added
 * @param fixer - The fixer object used to create the fixes
 * @param sourceCode - The source code object used to analyze the code and find tokens
 * @param node - The node after which to check for a comma and remove it if exists
 */
function removeCommaAfterNode(fixes: Rule.Fix[], fixer: Rule.RuleFixer, sourceCode: SourceCode, node: AST.Token | ESTree.Node) {
	const token = sourceCode.getTokenAfter(node)
	if (token && isComma(token)) {
		const nextToken = sourceCode.getTokenAfter(token)
		// get the empty space to remove double whitespace after removing the comma
		const emptySpace = sourceCode.text
			.slice(token.range[1], nextToken?.range[0] ?? token.range[1])
			.match(/^[ \t]*[\n\r]*/)
			?.[0] ?? ''
		if (emptySpace) {
			fixes.push(fixer.removeRange([token.range[0], token.range[1] + emptySpace.length]))
		} else {
			fixes.push(fixer.remove(token))
		}
	}
}

/**
 * Get the text for a new top-level type-only import based on the given inline type specifiers.
 *
 * @param node - The original import declaration node containing the inline type specifiers
 * @param sourceCode - The source code object used to analyze the code and find tokens
 * @param specifiers - The inline type specifiers for which to generate the new import text
 */
function getImportText(
	node: ESTree.ImportDeclaration | TSESTree.ImportDeclaration,
	sourceCode: SourceCode,
	specifiers: TSESTree.ImportSpecifier[],
) {
	const sourceString = sourceCode.getText(node.source)
	if (specifiers.length === 0) {
		return ''
	}

	const names = specifiers.map((s) => {
		const name = 'name' in s.imported ? s.imported.name : s.imported.value
		if (name === s.local.name) {
			return name
		}
		return `${name} as ${s.local.name}`
	})
	// insert a fresh top-level import
	return `import type {${names.join(', ')}} from ${sourceString};`
}
