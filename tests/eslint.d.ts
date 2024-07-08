/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
export { }

declare global {
	namespace jest {
		interface Matchers<R> {
			toPass(): R;
			toHaveIssueCount(n: number): R;
			toHaveIssue(issue: string | {ruleId: string, line?: number}): R;
		}
	}
}
