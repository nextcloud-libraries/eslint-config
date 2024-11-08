import type { Rule } from 'eslint'
import noDeprecations from './no-deprecations.ts'
import noRemovedApis from './no-removed-apis.ts'

export const rules: Record<string, Rule.RuleModule> = {
	'@nextcloud/no-deprecations': noDeprecations,
	'@nextcloud/no-removed-apis': noRemovedApis,
}
