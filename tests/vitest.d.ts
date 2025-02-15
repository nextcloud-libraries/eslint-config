/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import 'vitest'

interface CustomMatchers<R = unknown> {
	toPass(): R
	toHaveIssueCount(n: number): R
	toHaveIssue(issue: string | {
		ruleId: string
		line?: number
	}): R
}

declare module 'vitest' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Assertion extends CustomMatchers {}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
