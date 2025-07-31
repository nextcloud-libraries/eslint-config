/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import * as vueUtils from 'eslint-plugin-vue/lib/utils/index.js'
import nonBreakingSpace from './non-breaking-space.ts'

const defineRule = (r: Rule.RuleModule) => r

export default defineRule({
	...nonBreakingSpace,

	create(context) {
		return vueUtils.defineTemplateBodyVisitor(context, nonBreakingSpace.create(context))
	},
})
