/* eslint-disable jsdoc/require-jsdoc */

// ✅ Single line function with one parameter
export async function singleLine(name: string): Promise<boolean> {
	return true
}

// ❌ Single line function with the { on the wrong line
export function singleLineWrongCurly(name: string): boolean {
	return true
}

// ❌ Single line function with space before parenthesis
export function singleLineSpace(name: string): boolean {
	return true
}

// ✅ Multi line function with consistent new lines
export function multiLine(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

// ❌ Multi line function with the { on the wrong line
export function multiLineWrongCurly(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

// ❌ Multi line function with space before parenthesis
export function multiLineWrongSpace(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

// ❌ Multi line function with missing trailing comma
export function multiLineWrongMissingComma(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

// ❌ Multi line function with inconsistent new lines
// Either make all parameters on new lines or fix this to be single line
export function multiLineInconsistentNewline(firstName: string, lastName: string): boolean {
	return false
}

// ❌ Multi line function with inconsistent new lines
// Make all parameters on new lines
export function multiLineInconsistentNewline2(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

// ❌ Multi line function with parameters on the same line but not the line of the opening parenthesis
// Either make all parameters on new lines or fix this to be single line
export function multiLineThatFeelsLikeASingleLine(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

// ❌ Top level functions should be function declarations for hoisting
function top1() {
	// ❌ Anonymous function with additional space before parenthesis
	const a = async function() {
		// ...
	}
}

// ❌ Arrow functions should not be used on top level but function declarations for hoisting
async function top2() {
	// ...
}

// ✅ Function calls should not have space before parenthesis
multiLine('a', 'b')

// ❌ Function call with space before parenthesis
multiLine('a', 'b')

// ❌ invalid space for optional chaining
top2?.()?.catch?.(() => {})
