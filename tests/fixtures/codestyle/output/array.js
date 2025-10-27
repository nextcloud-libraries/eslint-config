/* eslint-disable no-unused-vars */

// ❌ Trailing comma is required to make multi-line array diff-safe on changing the last element
// Here the trailing comma is missing on a multi-line array and extra comma is present on a single-line array
const items = [
	'first',
	'second',
	'third',
]
const LATIN_VOWELS = ['a', 'e', 'i', 'o', 'u']

// ❌ Multi-line array should have a single element per line to make it diff-safe and readable
// Here the last two elements are on the same line
const VARIANTS = [
	'primary',
	'secondary',
	'tertiary',
	'tertiary-no-background',
]

// ✅ In general it is recommended to prefer a multi-line array to make it diff-safe on adding/removing elements
// It is especially important for dynamic array which entries may change
const sampleUsers = [
	'admin',
	'alice',
	'bob',
]
// Even if there is only one element at the moment (more elements may be added later)
const MUTE_NOTIFICATIONS_USER_STATUSES = [
	'dnd',
]

// ✅ Single-line arrays are also fine for short and stable arrays which are not expected to change
// This is a developer's choice
const selectedItems = ['default_item']
const HTML_FORM_ACTIONS = ['POST', 'GET']

// ❌ Single-line array should have brackets on the same line while multi-line array should have brackets on the next line
const USER_STATUSES = [
	'online',
	'away',
	'dnd',
	'invisible',
	'offline',
]
// 🚧 Currently this is an edge case and isn't fixed properly...
const WEEKDAYS = ['Monday',	'Tuesday',	'Wednesday',	'Thursday',	'Friday',	'Saturday',	'Sunday']
