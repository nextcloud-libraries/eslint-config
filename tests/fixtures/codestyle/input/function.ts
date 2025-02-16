/**
 * A function with an additional space before the parenthesis
 *
 * @param name
 */
export function foo (name: string): boolean {
	return true
}

/**
 * A function with the { on the wrong line
 *
 * @param name
 */
export function bar(name: string): boolean
{
	return true
}

/**
 * Also a function with the { on the wrong line
 *
 * @param firstName
 * @param lastName
 */
export function baz(
	firstName: string,
	lastName: string,
): boolean
{
	return false
}

/**
 * Parameters should always be either on the same line or have consistent new lines
 *
 * @param num
 * @param enable
 */
export function doSomething(num: number,
	enable: boolean) {
	// ...
}

/**
 * Same here: Parameters should always be either on the same line or have consistent new lines
 *
 * @param num
 * @param enable
 */
export function doSomethingDifferent(
	num: number, enable: boolean
) {
	// ...
}

// Anonymous function with additional space before parenthesis
const a = async function () {
	// ...
}

// Tests for function calling

// This is valid syntax
doSomething(1, true)
// This has an invalid space before the parenthesis
doSomething (1, true)

// invalid space for optional chaining
a ?.()?. catch ?. (() => {})