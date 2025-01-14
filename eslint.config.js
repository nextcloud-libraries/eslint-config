/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommended } from './dist/index.mjs'

export default [
	{
		ignores: ['tests/fixtures/'],
	},
	...recommended,
]
