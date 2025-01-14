/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import type { UserConfig } from 'vite'
import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig({
	index: 'lib/index.ts',
}, {
	thirdPartyLicense: false,
	DTSPluginOptions: { rollupTypes: true },
	// Make the package version available for the plugin meta
	replace: {
		__PACKAGE_VERSION__: JSON.stringify(process.env.npm_package_version),
	},

	config: {
		test: {
			setupFiles: ['tests/setup.ts'],
		},
	} as UserConfig,
})
