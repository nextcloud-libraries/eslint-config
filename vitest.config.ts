/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: CC0-1.0
 */
import type { UserConfig } from 'vitest/node'

export default {
	test: {
		setupFiles: ['tests/setup.ts'],
	} satisfies UserConfig,
}
