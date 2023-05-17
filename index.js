module.exports = {
	root: true,
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		// Allow jest syntax in the src folder
		jest: true,
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		ecmaVersion: 6,
		requireConfigFile: false,
	},
	extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:n/recommended',
		'plugin:vue/recommended',
		'plugin:@nextcloud/recommended',
		'plugin:jsdoc/recommended',
		'standard',
	],
	settings: {
		'import/resolver': {
			node: {
				paths: ['src'],
				extensions: ['.js', '.vue'],
			},
			exports: {
				conditions: ['import'],
			},
		},
		jsdoc: {
			tagNamePreference: {
				returns: 'return',
			},
			mode: 'typescript',
		},
	},
	plugins: ['vue', 'n', 'jsdoc'],
	rules: {
		// space before function ()
		'space-before-function-paren': ['error', {
			anonymous: 'never',
			named: 'never',
			asyncArrow: 'always',
		}],
		// stay consistent with array brackets
		'array-bracket-newline': ['error', 'consistent'],
		// tabs only for indentation
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'vue/html-indent': ['error', 'tab'],
		// allow spaces after tabs for alignment
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		// only debug console
		'no-console': ['error', { allow: ['error', 'warn', 'info', 'debug'] }],
		// classes blocks
		'padded-blocks': ['error', { classes: 'always' }],
		// always have the operator in front
		'operator-linebreak': ['error', 'before'],
		// ternary on multiline
		'multiline-ternary': ['error', 'always-multiline'],
		// force proper JSDocs
		'jsdoc/require-returns': 0,
		'jsdoc/require-returns-description': 0,
		'jsdoc/tag-lines': ['off'],
		// disallow use of "var"
		'no-var': 'error',
		// suggest using const
		'prefer-const': 'error',
		// es6 import/export and require
		'n/no-unpublished-require': ['off'],
		'n/no-unsupported-features/es-syntax': ['off'],
		// PascalCase components names for vuejs
		// https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended
		'vue/component-name-in-template-casing': ['error', 'PascalCase'],
		// force name
		'vue/match-component-file-name': ['error', {
			extensions: ['jsx', 'vue', 'js'],
			shouldMatchCase: true,
		}],
		// space before self-closing elements
		'vue/html-closing-bracket-spacing': 'error',
		// no ending html tag on a new line
		'vue/html-closing-bracket-newline': ['error', { multiline: 'never' }],
		// check vue files too
		'n/no-missing-import': ['error', {}],
		// code spacing with attributes
		'vue/max-attributes-per-line': ['error', {
			singleline: 3,
			multiline: 1,
		}],
		'vue/first-attribute-linebreak': ['error', {
			singleline: 'beside',
			multiline: 'beside',
		}],
		// Allow single-word components names
		'vue/multi-word-component-names': ['off'],
		// custom event naming convention
		'vue/custom-event-name-casing': ['error', 'kebab-case', {
			// allows custom xxxx:xxx events formats
			ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'],
		}],
		// always add a trailing comma (for diff readability)
		'comma-dangle': ['warn', 'always-multiline'],
		// Allow shallow import of @vue/test-utils and @testing-library/vue in order to be able to use it in
		// the src folder
		'n/no-unpublished-import': ['error', {
			allowModules: ['@vue/test-utils', '@testing-library/vue'],
		}],
		// require object literal shorthand syntax
		'object-shorthand': ['error', 'always'],
		// Warn when file extensions are not used on import paths
		'import/extensions': ['warn', 'always', {
			ignorePackages: true,
		}],
	},
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			extends: [
				'@vue/eslint-config-typescript/recommended',
				'plugin:import/typescript',
			],
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
			rules: {
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
		},
	],
}
