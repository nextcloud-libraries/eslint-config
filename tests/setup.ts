/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { ESLint, Linter } from 'eslint'

import { expect } from 'vitest'

/**
 * Check if linting a file did not throw any errors or warnings
 *
 * @param received Lint result
 */
function hasNoIssues(received: ESLint.LintResult) {
	// dirty type check
	if (received?.errorCount === undefined) {
		throw new Error('Expected ESLintResult')
	}

	return received.errorCount === 0 && received.warningCount === 0
}

/**
 * Check if linting of multiple fils
 *
 * @param received The result of the linting
 */
function assertLintingPassed(received: ESLint.LintResult | ESLint.LintResult[]) {
	// allow single ESLintResult
	if (!Array.isArray(received)) {
		received = [received]
	}

	const errors = [] as {
		file: string
		errors: Linter.LintMessage[]
	}[]
	const pass = received.every((result) => {
		// save issues
		errors.push({
			file: result.filePath,
			errors: result.messages,
		})
		return hasNoIssues(result)
	})

	return {
		pass,
		message: () => {
			if (pass) {
				return 'Expected file to not pass eslint, but got no issues'
			} else {
				const errorMessages = errors.map((m) => `file: ${m.file}\n${m.errors.map((e) => `line: ${e.line}: ${e.ruleId || e.message}`)}`)
				return `Expected file to pass eslint, got issues:\n${errorMessages.join('\n')}`
			}
		},
	}
}

/**
 * Count the total amount of issues
 *
 * @param received lint result
 * @return total amount of issues
 */
function countIssues(received: ESLint.LintResult) {
	return received.errorCount + received.warningCount
}

/**
 * Check if exactly the same number of issues is reported
 *
 * @param received the lint result
 * @param expected number of expected issues
 * @return jest matcher result
 */
function assertHavingNIssues(received: ESLint.LintResult | ESLint.LintResult[], expected: number) {
	if (!(typeof expected === 'number')) {
		throw new Error('Expected a number as expected value')
	}

	if (!Array.isArray(received)) {
		received = [received]
	}

	const issues = received.map(countIssues).reduce((p, c) => p + c)
	const pass = issues === expected

	return {
		pass,
		message: () => pass ? `Expected not to find exactly ${expected} issues.` : `Expected ${expected} issues, found ${issues}`,
	}
}

/**
 * Check if result contains the expected issue
 *
 * @param received the lint result
 * @param issue the expected issue
 * @return jest matcher result
 */
function assertHavingIssue(received: ESLint.LintResult | ESLint.LintResult[], issue: string | {
	ruleId: string
	line?: number
}) {
	if (!Array.isArray(received)) {
		received = [received]
	}

	// Should not pass
	if (assertLintingPassed(received).pass) {
		return {
			pass: false,
			message: () => 'Expected issue, but no linting issues found.',
		}
	}

	const name = typeof issue === 'string' ? issue : issue.ruleId
	const result = received.some((data) => {
		return data.messages.some((message) => {
			// ensure name matches
			if (message.ruleId !== name) {
				return false
			}
			// if line is requested ignore not matching ones
			if (typeof issue === 'object' && issue.line !== undefined && issue.line !== message.line) {
				return false
			}
			// otherwise matched
			return true
		})
	})

	const onLine = typeof issue === 'string' ? '' : ` on line ${issue.line}`
	return {
		pass: result,
		message: () => result ? `Unexpected error '${name}'${onLine} found.` : `Expected error '${name}'${onLine} not found.`,
	}
}

/**
 * Add some custom matchers for ESLint to jest
 */
expect.extend({
	toPass: assertLintingPassed,
	toHaveIssueCount: assertHavingNIssues,
	toHaveIssue: assertHavingIssue,
})
