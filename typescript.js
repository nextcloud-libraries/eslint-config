const base = require('./parts/base.js')
const typescriptOverrides = require('./parts/typescript.js')
const vueOverrides = require('./parts/vue.js')

/**
 * Config for projects written in Typescript + vue including vue files written in Typescript (`<script lang='ts'>`)
 */
module.exports = {
	...base,
	overrides: [
		// Add Typescript rules also for vue files
		{
			...typescriptOverrides,
			files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
		},
		// Use different parser for vue files script section
		{
			...vueOverrides,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				sourceType: 'module',
			},
		},
	],
}
