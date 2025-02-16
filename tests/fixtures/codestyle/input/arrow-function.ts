/**
 * An arrow function with missing space between `async` and the parenthesis
 */
const asyncArrow = async(name: string) => {
	//
}

/**
 * An arrow function with the { on the wrong line
 */
const arrow = (name: string) =>
{
	//
}

// Arrow functions should always have parenthesis for readability
const arr = ['myArray'].map(item => item.length)
