/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Rule } from 'eslint'

import { createVersionValidator } from '../utils/version-parser.ts'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const global = {
	$: '19.0.0',
	Backbone: '18.0.0',
	Clipboard: '18.0.0',
	ClipboardJs: '18.0.0',
	DOMPurify: '18.0.0',
	formatDate: '16.0.0',
	getURLParameter: '16.0.0',
	Handlebars: '18.0.0',
	humanFileSize: '16.0.0',
	initCore: '17.0.0',
	jQuery: '19.0.0',
	jstimezonedetect: '18.0.0',
	jstz: '18.0.0',
	md5: '18.0.0',
	moment: '18.0.0',
	oc_appconfig: '17.0.0',
	oc_appswebroots: '17.0.0',
	oc_capabilities: '17.0.0',
	oc_config: '17.0.0',
	oc_current_user: '17.0.0',
	oc_debug: '17.0.0',
	oc_isadmin: '17.0.0',
	oc_requesttoken: '17.0.0',
	oc_webroot: '17.0.0',
	OCDialogs: '17.0.0',
	relative_modified_date: '16.0.0',
}

const oc = {
	AppConfig: '16.0.0',
	L10n: '26.0.0',
	SystemTags: '32.0.0',
	_capabilities: '17.0.0',
	addTranslations: '17.0.0',
	basename: '18.0.0',
	coreApps: '17.0.0',
	currentUser: '19.0.0',
	dialogs: '30.0.0',
	dirname: '18.0.0',
	encodePath: '18.0.0',
	fileIsBlacklisted: '18.0.0',
	filePath: '19.0.0',
	generateUrl: '19.0.0',
	get: '19.0.0',
	getCanonicalLocale: '20.0.0',
	getCurrentUser: '19.0.0',
	getHost: '17.0.0',
	getHostName: '17.0.0',
	getPort: '17.0.0',
	getProtocol: '17.0.0',
	getRootPath: '19.0.0',
	imagePath: '19.0.0',
	isSamePath: '18.0.0',
	joinPaths: '18.0.0',
	linkTo: '19.0.0',
	linkToOCS: '19.0.0',
	linkToRemote: '19.0.0',
	set: '19.0.0',
	webroot: '19.0.0',
}

const oca = {
	Search: '20.0.0',
}

const ocp = {
	Toast: '19.0.0',
}

const ocNested = {
	Util: {
		formatDate: '20.0.0',
		humanFileSize: '20.0.0',
		relativeModifiedDate: '20.0.0',
	},
	dialogs: {
		fileexists: '29.0.0',
	},
	config: {
		blacklist_files_regex: '30.0.0',
		forbidden_filename_characters: '30.0.0',
	},
}

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			description: 'Deprecated Nextcloud APIs',
			recommended: true,
		},
		// fixable: null or "code" or "whitespace"
		schema: [
			{
				// We accept one option which is an object
				type: 'object',
				properties: {
					// if we should try to find an appinfo and only handle APIs removed before the max-version
					parseAppInfo: {
						type: 'boolean',
					},
					// Set a Nextcloud target version, only APIs removed before that versions are checked
					targetVersion: {
						type: 'string',
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			deprecatedGlobal:
				'The global property or function {{name}} was deprecated in Nextcloud {{version}}',
		},
	},

	create: function(context) {
		const checkTargetVersion = createVersionValidator(context)

		return {
			MemberExpression: function(node) {
				// OC.x
				if (
					'name' in node.object
					&& 'name' in node.property
					&& node.object.name === 'OC'
					&& Object.hasOwn(oc, node.property.name)
					&& checkTargetVersion(oc[node.property.name])
				) {
					context.report({
						node,
						message: `The property or function OC.${node.property.name} was deprecated in Nextcloud ${oc[node.property.name]}`,
					})
				}
				// OCA.x
				if (
					'name' in node.object
					&& 'name' in node.property
					&& node.object.name === 'OCA'
					&& Object.hasOwn(oca, node.property.name)
					&& checkTargetVersion(oca[node.property.name])
				) {
					context.report({
						node,
						message: `The property or function OCA.${node.property.name} was deprecated in Nextcloud ${oca[node.property.name]}`,
					})
				}
				// OCP.x
				if (
					'name' in node.object
					&& 'name' in node.property
					&& node.object.name === 'OCP'
					&& Object.hasOwn(ocp, node.property.name)
					&& checkTargetVersion(ocp[node.property.name])
				) {
					context.report({
						node,
						message: `The property or function OCP.${node.property.name} was deprecated in Nextcloud ${ocp[node.property.name]}`,
					})
				}

				// OC.x.y
				if (
					node.object.type === 'MemberExpression'
					&& 'name' in node.object.object
					&& node.object.object.name === 'OC'
					&& 'name' in node.property
					&& 'name' in node.object.property
					&& Object.hasOwn(ocNested, node.object.property.name)
					&& Object.hasOwn(ocNested[node.object.property.name], node.property.name)
				) {
					const version = ocNested[node.object.property.name][node.property.name]
					if (checkTargetVersion(version)) {
						const prop = [
							'OC',
							node.object.property.name,
							node.property.name,
						].join('.')
						const deprecatedSince = ocNested[node.object.property.name][node.property.name]
						context.report({
							node,
							message: `The property or function ${prop} was deprecated in Nextcloud ${deprecatedSince}`,
						})
					}
				}
			},
			Program(node) {
				// Logic adapted from https://github.com/eslint/eslint/blob/master/lib/rules/no-restricted-globals.js
				const scope = context.sourceCode.getScope(node)
				const report = ({ identifier }) => {
					if (checkTargetVersion(global[identifier.name])) {
						context.report({
							node,
							messageId: 'deprecatedGlobal',
							data: {
								name: identifier.name,
								version: global[identifier.name],
							},
						})
					}
				}

				// Report variables declared elsewhere (ex: variables defined as "global" by eslint)
				scope.variables.forEach((variable) => {
					if (
						!variable.defs.length
						&& Object.hasOwn(global, variable.name)
					) {
						variable.references.forEach(report)
					}
				})

				// Report variables not declared at all
				scope.through.forEach((reference) => {
					if (Object.hasOwn(global, reference.identifier.name)) {
						report(reference)
					}
				})
			},
		}
	},
}

export default rule
