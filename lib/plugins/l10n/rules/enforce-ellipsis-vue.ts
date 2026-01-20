/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Rule } from 'eslint'

import { defineTemplateBodyVisitor } from '../../nextcloud-vue/utils/vue-template-visitor.ts'
import enforceEllipsis from './enforce-ellipsis.ts'

const defineRule = (r: Rule.RuleModule) => r

export default defineRule({
	...enforceEllipsis,

	create(context) {
		return defineTemplateBodyVisitor(context, enforceEllipsis.create(context))
	},
})
