<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->	

# Migration Guide for @nextcloud/eslint-config v9 with ESLint 9/10

- [1. Update dependencies](#1-update-dependencies)
- [2. Migrate to ESLint 10 with flat config](#2-migrate-to-eslint-10-with-flat-config)
  - [Migrate `package.json/scripts`](#migrate-packagejsonscripts)
  - [Rename (or create) eslint config file](#rename-or-create-eslint-config-file)
  - [Migrate eslint config file](#migrate-eslint-config-file)
  - [Remove `.eslintignore`](#remove-eslintignore)
  - [Validate](#validate)
  - [Commit](#commit)
- [3. Fix auto-fixable problems](#3-fix-auto-fixable-problems)
- [4. Manually fix the rest of the errors](#4-manually-fix-the-rest-of-the-errors)
  - [Component name "..." should always be multi-word](#component-name--should-always-be-multi-word-vuemulti-word-component-names)
  - [Unexpected console statement](#unexpected-console-statement-no-console)
  - [`src/store/index.js` (Vuex): 'process' is not defined](#srcstoreindexjs-vuex-process-is-not-defined-no-undef)
  - [`webpack.js`: 'require' is not defined](#webpackjs-require-is-not-defined-no-undef)
  - [`@nextcloud/l10n-*` rules change translation strings](#nextcloudl10n-non-breaking-space-and-nextcloudl10n-enforce-ellipsis-changes-translation-strings)
- [5. Check the app](#5-check-the-app)

## 1. Update dependencies

`@nextcloud/eslint-config` and `eslint` must be updated simultaneously.\
Simply uninstall and install them again:

```sh
npm un eslint @nextcloud/eslint-config
npm i -D eslint@10 @nextcloud/eslint-config@9
```

and commit:

```sh
git commit package*.json -S -m 'build(deps-dev): bump to eslint@10 and @nextcloud/eslint-config@9'
```

## 2. Migrate to ESLint 10 with flat config

### Migrate `package.json/scripts`

When running **ESLint**, `--ext` and globs are no longer needed - it is covered by the config.

```diff
   "scripts": {
-    "lint": "eslint --ext .js,.vue src",
+    "lint": "eslint",
-    "lint:fix": "eslint --fix --ext .js,.vue src"
+    "lint:fix": "eslint --fix"
   },
```

<table>
<tr><th>Before</th><th>After</th></tr>

<tr><td>

```json
{
  "scripts": {
    "lint": "eslint --ext .js,.vue src",
    "lint:fix": "eslint --fix --ext .js,.vue src"
  }
}
```

</td><td>

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

</td></tr>
</table>


### Rename (or create) eslint config file

Rename the config file (`.eslintrc.js`, `.eslintrc`, `.eslintrc.json` etc.) to:
- `eslint.config.js` if your `package.json` has `"type": "module"`
- `eslint.config.mjs` otherwise

If there was no config file, the config probably was in `package.json`. Create the file and move the config from the `package.json`.

### Migrate eslint config file

A simple default configuration for **app** on **JavaScript** with **Vue 3** would be:

```js
// 📁 eslint.config.js

import { defineConfig } from 'eslint/config'
import { recommendedJavascript } from '@nextcloud/eslint-config'

export default defineConfig([
	...recommendedJavascript,
])
```

or with the corresponding configuration:

| 🔽 Config                    | Language   | Vue version   |
|-----------------------------|------------|---------------|
| `recommended`               | TypeScript | Vue 3 or none |
| `recommendedJavascript`     | JavaScript | Vue 3 or none |
| `recommendedVue2`           | TypeScript | Vue 2         |
| `recommendedVue2Javascript` | JavaScript | Vue 2         |

**If you have more complicated configurations, you might need manual migration using:**
- [ESLint | Configuration Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [@nextcloud/eslint-config v9 Release Notes](https://github.com/nextcloud-libraries/eslint-config/releases#release-v9.0.0) 

### Remove `.eslintignore`

If it had non-standard files to ignore, you _might_ need to add them to the config:

```js
// 📁 eslint.config.js
import { defineConfig } from 'eslint/config'
import { recommendedJavascript } from '@nextcloud/eslint-config'

export default defineConfig([
	...recommendedJavascript,
	// 🔽 Add the ignore block
	{
		name: '<appid>/ignore',
		ignorePatterns: [/* ... */],
	},
])
```

### Validate

Try to run `eslint` to make sure it prints linting errors and not configuration errors.

```sh
npm run lint
```

### Commit

```sh
git add eslint.config.*
git commit -S -am 'chore(eslint): migrate config to @nextcloud/eslint-config@9'
```

## 3. Fix auto-fixable problems

In a small app just run:

```sh
npm run lint:fix
```

and commit:

```sh
git commit -S -am 'chore(eslint): auto fix'
```

In large apps you might want to split changes into individual commits to better see what's changing, or disable some huge rules.

Example of such rules:
- `perfectionist/sort-imports` - import order (keep it)
- `package-json/sort-package-json` - package.json properties sorting (keep it)
- `antfu/top-level-function` - `function foo() {}` instead of `const foo = () => {}` on top level in modules
- `@stylistic/arrow-parens` - `(foo) => {}` instead of `foo => {}`
- `@stylistic/exp-list-style` and other `@stylistic/*` rules - lists/arrays/object/function parameters formatting
- `vue/first-attribute-linebreak` - puts the first attribute on a new line in multi-line tags
- `vue/attribute-hyphenation` - `<Comp fooBar />` instead of `<Comp foo-bar />`
- `vue/v-on-event-hyphenation` - `<Comp @fooBar />` instead of `<Comp @foo-bar />`
- `vue/slot-name-casing` - `<template #slotName>` and `<slot name="slotName">` instead of `<template #slot-name>` and `<slot name="slot-name">` (make sure that both definitions and usages are updated)

You can disable the rules in the eslint config:
```js
// 📁 eslint.config.js
import { defineConfig } from 'eslint/config'
import { recommendedJavascript } from '@nextcloud/eslint-config'

export default defineConfig([
	...recommendedJavascript,
	// 🔽 Add block with disabled rules
	{
		name: '<appid>/temporary-disabled',
		rules: {
			// TODO: enable the rule later
			'vue/slot-name-casing': 'off',
    },
	},
])
```

## 4. Manually fix the rest of the errors

Here are the most common errors.

### Component name "..." should always be multi-word (`vue/multi-word-component-names`)

Rename components (except `App.vue`) to multi-word, including:

- File name
- `name` option in Options API
- `components` registration in Options API
- `<Component>` tags in templates

```js
// BEFORE
// 📁 Admin.vue
import Admin from './Admin.vue'

export default {
	name: 'Admin',
	components: {
		Admin,
	},
	template: `<Admin />`,
	// ...
}

// AFTER
// 📁 AdminSettings.vue
import AdminSettings from './AdminSettings.vue'

export default {
	name: 'AdminSettings',
	components: {
		AdminSettings,
	},
	template: `<AdminSettings />`,
}
```

or ignore the rule:

```js
// 📁 eslint.config.js
// ...
export default [
	...recommendedJavascript,
	{
		name: '<appid>/temporary-disabled',
		rules: {
			// TODO: rename components to multi-word
			'vue/multi-word-component-names': 'off',
		},
	},
]
```

### Unexpected console statement (`no-console`)

Migrate to [@nextcloud/logger](https://github.com/nextcloud-libraries/nextcloud-logger/), for example:

```js
// BEFORE
console.info('Updated', foo, bar)
console.error('Unexpected error', error)

// AFTER
// 📁 logger.ts
import { getLoggerBuilder } from '@nextcloud/logger'
const logger = getLoggerBuilder()
		.setApp('<appid>')
		.detectUser()
		.build()

// 📁 Other modules
import { logger } from './logger.ts'
logger.info('Updated', { foo, bar })
logger.error('Unexpected error', { error })
```

or ignore the rule:

```js
// 📁 eslint.config.js
// ...
export default [
	...recommendedJavascript,
	{
		name: '<appid>/temporary-disabled',
		rules: {
			// TODO: migrate to @nextcloud/logger
			'no-console': 'off',
		},
	},
]
```

### `src/store/index.js` (Vuex): 'process' is not defined (`no-undef`)

This is likely the only place with `process.env.NODE_ENV`. Suppress with a comment:

```js
// 📁 src/store/index.js

export default createStore({
	// 🔽 Add this comment 🔽
	// eslint-disable-next-line no-undef -- build-time Webpack constant
	strict: process.env.NODE_ENV !== 'production',
})
```

### `webpack.js`: 'require' is not defined (`no-undef`)

```
/webpack.js
   6:23  error  'require' is not defined    no-undef
   7:14  error  'require' is not defined    no-undef
```

1. Rename `webpack.js` to standard `webpack.config.js`
   - or `webpack.config.cjs` if `package.json` has `"type": "module"`
2. Remove extra `-c` (`--config`) parameters in `package.json`

```diff
   "scripts": {
-    "build": "NODE_ENV=production webpack --mode production --progress --config webpack.js",
-    "dev": "NODE_ENV=development webpack --mode development --progress --config webpack.js",
+    "build": "NODE_ENV=production webpack --mode production --progress",
+    "dev": "NODE_ENV=development webpack --mode development --progress",
-    "watch": "NODE_ENV=development webpack --mode development --progress --watch --config webpack.js"
+    "watch": "NODE_ENV=development webpack --mode development --progress --watch"
   },
```

<table>
<tr><th>Before</th><th>After</th></tr>

<tr><td>

```json
{
  "scripts": {
    "build": "NODE_ENV=production webpack --mode production --progress --config webpack.js",
    "dev": "NODE_ENV=development webpack --mode development --progress --config webpack.js",
    "watch": "NODE_ENV=development webpack --mode development --progress --watch --config webpack.js"
  }
}
```

</td><td>

```json
{
  "scripts": {
    "build": "NODE_ENV=production webpack --mode production --progress",
    "dev": "NODE_ENV=development webpack --mode development --progress",
    "watch": "NODE_ENV=development webpack --mode development --progress --watch"
  }
}
```

</td></tr>
</table>

and commit

```sh
git add webpack.config.*
git commit -S -am 'chore(webpack): rename to standard webpack.config.js'
```

### `@nextcloud/l10n-non-breaking-space` and `@nextcloud/l10n-enforce-ellipsis` changes translation strings

These rules enforces an actual ellipsis symbol and breaking spaces before them. It may change many translation keys. Do not worry about it. This is handled by Transifex.

## 5. Check the app

Changes in the code could have been huge. It's worth double-checking before merging, for example:
- `npm run build` to check that the app still builds
- `npm run test` to run tests if any
- `npm run ts:check` to run typechecking if any
- Open the app in the browser and smoke-test manually
