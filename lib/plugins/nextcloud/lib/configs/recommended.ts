import type { ESLint } from 'eslint'

/**
 * The recommended plugin configuration for Nextcloud
 */
export function recommended(plugin: ESLint.Plugin) {
	plugin.configs = plugin.configs ?? {}

	// registering the configuration
	plugin.configs['@nextcloud/recommended'] = {
		name: '@nextcloud/recommended',
		plugins: {
			'@nextcloud': plugin,
		},
		rules: {
			'@nextcloud/no-deprecations': ['warn'],
			'@nextcloud/no-removed-apis': ['error'],
		},
	}
}
