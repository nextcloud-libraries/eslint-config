// Only quote if needed
const obj = {
	'noQuotesNeeded': true,
	'quotes-needed': false,
}

// Prefer shorthand property
const user = 'jdoe'
const obj2 = {
	user: user,
	id: 123,
}

// Require spaces around braces
const obj3 = {first: 1}

// Allow all properties in one line
const obj4 = { first: 1, second: 'two' }

// Use trailing commas to be git diff friendly
const obj5 = {
	first: 1,
	second: 2
}