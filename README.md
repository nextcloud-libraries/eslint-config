<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->	
## @nextcloud/eslint-config

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/eslint-config)](https://api.reuse.software/info/github.com/nextcloud-libraries/eslint-config)
[![npm last version](https://img.shields.io/npm/v/@nextcloud/eslint-config.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/eslint-config)
[![Lint status](https://img.shields.io/github/actions/workflow/status/nextcloud-libraries/eslint-config/lint-eslint.yml?label=lint&style=flat-square)](https://github.com/nextcloud-libraries/eslint-config/actions/workflows/lint.yml)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&style=flat-square&logo=dependabot)](https://dependabot.com)


This is a package containing the unified global eslint config used by all nextcloud apps and libraries.
It contains the necessary dependencies and peerDependencies so that other apps cannot update if this config does not support it.
Please always use dependabot to update your apps, OR pay attention to the peer dependencies error messages!

## Installation

```bash
npm install @nextcloud/eslint-config --save-dev
```

## Usage

> [!NOTE]  
> Since version 9 this package depends on ESLint 9, which uses the new flat config system.

This package provides some predefined configurations you can choose from.
For the recommended setup add a file `eslint.config.js` in the root directory of your app repository with the following content:

```js
import { recommended } from './dist/index.mjs'

export default [
	...recommended,
]
```

### Available configurations

Instead of the `recommended` configuration this package also provides some alternatives, depending on your app setup you can also choose:

* `recommended`
  * General rules including code style
  * Support for Typescript
  * Support for Vue **3**
  * Support Vue files with Typescript syntax (the script within `.vue` files will be handled as Typescript).
* `recommendedJavascript`
  * Same as `recommended` but Vue files (the script part) will be handled as Javascript.
* `recommendedVue2`
  * Same as `recommended` but Vue files are considered in Vue 2 syntax.
* `recommendedVue2Javascript`
  * Same as `recommended` but Vue files are considered in Vue 2 syntax and the script part will be handled as Javascript instead of Typescript.

## Release new version

 1. Update CHANGELOG.md file with the latest changes
 2. Bump the package version with `npm version`
 3. Push version bump commit
 4. Create a new release with proper changelog https://github.com/nextcloud-libraries/eslint-config/releases/new
