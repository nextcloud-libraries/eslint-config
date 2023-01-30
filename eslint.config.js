// New eslint syntax
// https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";

import path from "path";
import globals from "globals"
import jest from 'eslint-plugin-jest'
import cypress from 'eslint-plugin-cypress'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

export default [
	'eslint:recommended',
	// compat: Key "plugins": Key "0": Expected an object
	...compat.extends('plugin:import/errors'),
	// compat: Key "plugins": Key "0": Expected an object
	...compat.extends('plugin:import/warnings'),
	// compat: unexpected key: global
	...compat.extends('plugin:n/recommended'),
	// compat: Unexpected key "extends"
	...compat.extends('plugin:vue/recommended'),
	// compat: Unexpected key "env" found.
	...compat.extends('plugin:@nextcloud/recommended'),
	// compat: Key "plugins": Key "0": Expected an object
	...compat.extends('plugin:jsdoc/recommended'),
	// compat: unexpected key "parserOptions"
	...compat.extends('standard'),
	// compat: Key "plugins": Key "0": Expected an object.
	...compat.extends('plugin:jest/recommended'),
	// compat: `plugins` uses strings instead of objects
	// & does not work with compat: "languageOptions": Key "globals": Global "AudioWorkletGlobalScope " has leading or trailing whitespace
	//...compat.extends('plugin:cypress/recommended'),
	{
		files: [
			'**/*.js',
			'**/*.vue',
		],
		// node_modules is automatically ignored
		ignores: ['dist/**'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				...globals.builtin,
				...globals.node,
			},
			parserOptions: {
				parser: '@babel/eslint-parser',
				ecmaVersion: 2020,
				requireConfigFile: false,
			},
		},
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
			// Disable to not enforce install jest for not non testing files
			'jest/no-deprecated-functions': ['off'],
			// Warn when file extensions are not used on import paths
			'import/extensions': ['warn', 'always', {
				ignorePackages: true,
			}],
		},
	},
	{
		files: ['**/*.ts'],
		extends: [
			'@vue/eslint-config-typescript/recommended',
			'plugin:import/typescript',
		],
		languageOptions: {
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
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
				node: {
					paths: ['src'],
					extensions: ['.js', '.ts', '.vue'],
				},
			},
		},
	},
	{
		// Match jest test files
		'files': ['__tests__/**/*.*s', 'tests/**/*.*s'],
		// globals are included in plugin:jest
		rules: {
			'n/no-unpublished-import': 'off',
			'n/no-missing-import': 'off',
			'import/no-unresolved': 'off',
			'import/extensions': 'off',
			'jest/no-deprecated-functions': ['error'],
		},
		plugins: {
			jest,
		},
	
	},
	{
		// Match cypress and jest test files
		"files": ["*.cy.*s", "*.spec.*s", "cypress/**/*.*s"],
		// globals are included in cypress:jest
		rules: {
			"n/no-unpublished-import": "off",
			"n/no-missing-import": "off",
			"import/no-unresolved": "off",
			"import/extensions": "off",
		},
		plugins: {
			cypress,
		},
	},
	{
		// Match config files like babel.config.js, webpack.config.mjs, eslint.config.cjs etc.
		"files": ["*.config.*s"],
		"rules": {
			"n/no-unpublished-import": "off",
			"n/no-extraneous-import": "off",
		},
	},
]
