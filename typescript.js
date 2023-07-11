const base = require('./parts/base.js')
const cypressOverrides = require('./parts/cypress.js')
const typescriptOverrides = require('./parts/typescript.js')
const vueOverrides = require('./parts/vue.js')

// Use different parser for vue files script section
vueOverrides.parserOptions = {
	parser: '@typescript-eslint/parser',
	sourceType: 'module',
}

// Override vue rules with rules for Typescript
vueOverrides.rules = {
	...vueOverrides.rules,
	...typescriptOverrides.rules,
}

// Also extend from vue typescript eslint
vueOverrides.extends.push('@vue/eslint-config-typescript/recommended')

/**
 * Config for projects written in Typescript + vue including vue files written in Typescript (`<script lang='ts'>`)
 */
module.exports = {
	...base,
	overrides: [
		// Overrides for Typescript files
		{
			...typescriptOverrides,
		},
		// Setup different vue parser to support `<script setup>` correctly, especially for `lang="ts"`
		{
			...vueOverrides,
		},
		// additional configuration for cypress tests
		{
			...cypressOverrides,
		},
	],
}
