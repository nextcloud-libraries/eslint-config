/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import { defineTemplateBodyVisitor } from '../../nextcloud-vue/utils/vue-template-visitor.ts'
import nonBreakingSpace from './non-breaking-space.ts'

const defineRule = (r: Rule.RuleModule) => r

export default defineRule({
	...nonBreakingSpace,

	create(context) {
		return defineTemplateBodyVisitor(context, nonBreakingSpace.create(context))
	},
})
