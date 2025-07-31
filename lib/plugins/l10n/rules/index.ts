/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import enforceEllipsisVue from './enforce-ellipsis-vue.ts'
import enforceEllipsis from './enforce-ellipsis.ts'
import nonBreakingSpaceVue from './non-breaking-space-vue.ts'
import nonBreakingSpace from './non-breaking-space.ts'

export const rules = {
	'enforce-ellipsis': enforceEllipsis,
	'enforce-ellipsis-vue': enforceEllipsisVue,
	'non-breaking-space': nonBreakingSpace,
	'non-breaking-space-vue': nonBreakingSpaceVue,
}
