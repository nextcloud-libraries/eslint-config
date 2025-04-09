/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */

import { recommended } from './lib/index.ts'

export default [
	{
		ignores: ['tests/fixtures/'],
	},
	...recommended,
]
