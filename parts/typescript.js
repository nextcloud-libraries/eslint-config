/** Rules for typescript */
module.exports = {
	files: ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx'],
	extends: [
		'@vue/eslint-config-typescript/recommended',
		'plugin:import/typescript',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {},
	rules: {
		// allow for generic type parameters on function calls
		'func-call-spacing': 'off',
		'@typescript-eslint/func-call-spacing': 'error',
		//
		'n/no-missing-import': 'off',
		'import/extensions': 'off',
		'jsdoc/check-tag-names': [
			'warn', {
				// for projects using typedoc
				definedTags: [
					'notExported',
					'packageDocumentation',
				],
			},
		],
		// Does not make sense with TypeScript
		'jsdoc/require-param-type': 'off',
		'@typescript-eslint/no-empty-function': 'off',
	},
	settings: {
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
			},
			node: {
				paths: ['src'],
				extensions: ['.(m|c)?js', '.ts', '.tsx', '.vue'],
			},
		},
	},
}
