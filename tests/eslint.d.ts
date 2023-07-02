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
