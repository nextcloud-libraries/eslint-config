/**
 * Allow chai expressions in cypress tests
 * @example
* ```js
* it('foo', () => {
*   const a = cy.stub()
*   // ...
*   expect(a).to.be.called
* })
* ```
*/
module.exports = {
	files: [
		'cypress/**/*',
	],
	plugins: [
		'chai-friendly',
	],
	rules: {
		'no-unused-expressions': 0,
		'chai-friendly/no-unused-expressions': 2,
	},
}
