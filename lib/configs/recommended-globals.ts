import type { ESLint } from 'eslint'

/**
 * Similar to `@nextcloud/recommended` config, but additionally with global variables.
 */
export function recommendedWithGlobals(plugin: ESLint.Plugin) {
	plugin.configs = plugin.configs ?? {}

	plugin.configs['@nextcloud/recommended-legacy'] = {
		name: '@nextcloud/recommended-globals',
		languageOptions: {
			globals: {
				t: 'readonly',
				n: 'readonly',
				OC: 'readonly',
				OCA: 'readonly',
				OCP: 'readonly',
			},
		},
		plugins: {
			'@nextcloud': plugin,
		},
		rules: {
			'@nextcloud/no-deprecations': ['warn'],
			'@nextcloud/no-removed-apis': ['error'],
		},
	}
}
