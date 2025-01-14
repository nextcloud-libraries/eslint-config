/**
 * A function with the { on the wrong line
 *
 * @param name
 */
export function foo(name: string): boolean {
	return true
}

/**
 * Also a function with the { on the wrong line
 *
 * @param firstName
 * @param lastName
 */
export function bar(
	firstName: string,
	lastName: string,
): boolean {
	return false
}

/**
 * Parameters should always be either on the same line or have consistent new lines
 *
 * @param num
 * @param enable
 */
export function doSomething(
	num: number,
	enable: boolean,
) {
	// ...
}

/**
 * Same here: Parameters should always be either on the same line or have consistent new lines
 *
 * @param num
 * @param enable
 */
export function doSomethingDifferent(num: number, enable: boolean) {
	// ...
}
