/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: MIT
 */

import type { ESLint } from 'eslint'
import { rules } from './rules/index.ts'
import configs from './configs/index.ts'
import { Linter } from 'eslint/universal'

const plugin: ESLint.Plugin = {
	// with ESLint flat configs this information needs to be provided manually by us
	meta: {
		name: '@nextcloud/eslint-plugin',
		version: __PACKAGE_VERSION__,
	},

	configs: {
		// empty as we need to prevent cyclic dependency between configs and the plugin
	},

	rules,
}

// Register the configs
// This is needed because they have cyclic dependencies on the plugin otherwise
configs.forEach((config) => config(plugin))

export default plugin as ESLint.Plugin & {
    configs: {
        recommended: Linter.Config,
        'recommended-globals': Linter.Config,
    },
}
