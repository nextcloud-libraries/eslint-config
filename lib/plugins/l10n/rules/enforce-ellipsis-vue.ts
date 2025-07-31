/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import * as vueUtils from 'eslint-plugin-vue/lib/utils/index.js'
import enforceEllipsis from './enforce-ellipsis.ts'

const defineRule = (r: Rule.RuleModule) => r

export default defineRule({
	...enforceEllipsis,

	create(context) {
		return vueUtils.defineTemplateBodyVisitor(context, enforceEllipsis.create(context))
	},
})
