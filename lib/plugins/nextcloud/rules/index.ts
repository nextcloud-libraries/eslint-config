import type { Rule } from 'eslint'
import noDeprecations from './no-deprecations.ts'
import noRemovedApis from './no-removed-apis.ts'

export const rules: Record<string, Rule.RuleModule> = {
	'no-deprecations': noDeprecations,
	'no-removed-apis': noRemovedApis,
}
