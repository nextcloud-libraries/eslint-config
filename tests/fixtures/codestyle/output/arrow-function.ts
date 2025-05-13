/**
 * Top Level Function
 */
function main() {
	/**
	 * An arrow function with missing space between `async` and the parenthesis
	 *
	 * @param name
	 */
	const asyncArrow = async (name: string) => {
		//
	}

	/**
	 * An arrow function with the { on the wrong line
	 *
	 * @param name
	 */
	const arrow = (name: string) => {
		//
	}

	// Arrow functions should always have parenthesis for readability
	const arr = ['myArray'].map((item) => item.length)
}
