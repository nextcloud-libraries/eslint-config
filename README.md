<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->	
## @nextcloud/eslint-config

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/eslint-config)](https://api.reuse.software/info/github.com/nextcloud-libraries/eslint-config)
[![npm last version](https://img.shields.io/npm/v/@nextcloud/eslint-config.svg)](https://www.npmjs.com/package/@nextcloud/eslint-config)
[![Lint status](https://img.shields.io/github/actions/workflow/status/nextcloud-libraries/eslint-config/lint-eslint.yml?label=lint)](https://github.com/nextcloud-libraries/eslint-config/actions/workflows/lint.yml)
[![Dependabot status](https://img.shields.io/badge/Dependabot-enabled-brightgreen.svg?longCache=true&logo=dependabot)](https://dependabot.com)


This is a package containing the unified global eslint config used by all nextcloud apps and libraries.
It contains the necessary dependencies and peerDependencies so that other apps cannot update if this config does not support it.
Please always use dependabot to update your apps, OR pay attention to the peer dependencies error messages!

The rules within this configuration are based on, and enforce, the Nextcloud [coding style](https://docs.nextcloud.com/server/latest/developer_manual/getting_started/coding_standards/javascript.html#code-style). Additionally, we follow the common code styles and best practices used in the Vue ecosystem as we strongly focussed on Vue based UI code.

> [!TIP]
> For backend code there is also a similar configuration for PHP code available enforcing our PHP codestyle, see [Nextcloud cs-fixer](https://github.com/nextcloud/coding-standard/).

### Installation

```bash
npm install --save-dev @nextcloud/eslint-config
```

### Usage

> [!NOTE]
> Since version 9 this package depends on ESLint 9, which uses the new flat config system.

This package provides some predefined configurations you can choose from.
For the recommended setup add a file `eslint.config.js` in the root directory of your app repository with the following content:

```js
import { recommended } from '@nextcloud/eslint-config'

export default [
	...recommended,
]
```

#### Available configurations

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

##### Configurations for Nextcloud libraries

For libraries some of the presets make no sense, like checking Nextcloud deprecated API.
But on the otherhand some rules should be enforced, like documenting all properties.
So for libraries use following configurations:

* `recommendedLibrary`
* `recommendedVue2Library`

#### Bundled plugins

This configuration also provides some bundled plugins with new rules, those options are already included in the recommended configurations.

It is possible to override the recommended configurations:
```js
// eslint.config.js
import { recommended } from '@nextcloud/eslint-config'
export default [
	...recommended,
	{
		files: ['**/*.js'],
		rules: {
			// Make deprecations error instead of warning level
			'@nextcloud/no-deprecations': ['error'],
		}
	}
]
```

You can even use the plugins without using the Nextcloud ESLint config:
```js
// eslint.config.js
import { nextcloudPlugin } from '@nextcloud/eslint-config'
export default [
	{
		files: ['**/*.js'],
		plugins: {
			'@nextcloud': nextcloudPlugin,
		},
		rules: {
			'@nextcloud/no-removed-apis': ['error', { targetVersion: '29.0.0' }],
		},
	}
]
```

##### `package-json` plugin
Rules:
- `sort-package-json`
  - Ensures the `package.json` is sorted in consistent order
  - Included as `error` level in recommended configurations

##### `@nextcloud` plugin
Rules:
- `no-deprecations`
  - Report usage of deprecated Nextcloud API
  - Included as `warn` level in recommended configuration
  - Available options
    ```ts
    {
      /**
       * Limit deprecated API to specified Nextcloud version
       * @example '29.0.0'
       * @default ''
       */
      targetVersion?: string
      /**
       * Try to find appinfo.xml to detect targetVersion
       * @default true
       */
      parseAppInfo?: boolean
    }
    ```
- `no-removed-apis`
  - Report usage of removed Nextcloud API
  - Included as `error` level in recommended configuration
  - Available options
    ```ts
    {
      /**
       * Limit removed API to specified Nextcloud version
       * @example '29.0.0'
       * @default ''
       */
      targetVersion?: string
      /**
       * Try to find appinfo.xml to detect targetVersion
       * @default true
       */
      parseAppInfo?: boolean
    }
    ```

##### `@nextcloud-l10n`
```ts
import { l10nPlugin  } from '@nextcloud/eslint-config'
```

Rules:
- `enforce-ellipsis`
  - Enforce consistent usageof ellipsis instead of tripple dots
  - Included as `error` level in recommended configuration
- `non-breaking-space`
  - Enforce non-breaking spaces before ellipsis
  - Included as `error` level in recommended configuration

#### Adding custom overrides

Sometimes additional rules need to be added for individual projects,
and while we do not recommend to override Nextcloud rules for code style (it should be consistent across all Nextcloud projects!),
it is possible to add such custom rules.

For example to enforce chains to be on separate lines:

```diff
- const a = foo().then((a) => a.b).catch((e) => e.c)
+ const a = foo()
+ 	.then((a) => a.b)
+ 	.catch((e) => e.c)
```

Adjust your `eslint.config.js` like this:

```js
import { recommended } from '@nextcloud/eslint-config'

export default [
	...recommended,
	{
		rules: {
			'@stylistic/newline-per-chained-call': ['error'],
		}
	},
]
```

### Update policy

We follow semantic versioning.

#### 💥 Breaking changes

For breaking changes, we consider those changes that break linting in a technical term, so linting itself is broken with the update.
This means, for example, require a new config format (ESLint legacy vs flat configuration). But it does not mean new errors or warnings while linting.

#### ✨ Minor changes

For minor changes we consider adding new rules or adding or removing plugins.
This means after updating a minor version, there can be new warnings or errors when linting the same code base.

#### 🐛 Patch changes

For this configuration we consider following changes fixes:
- Adjusting rules to follow our official code style.
- Adjusting rules if the current behavior is considered a bug.
- Removing rules

### Development

#### New rules

Adding new rules that enforce our code style can always be added.
Rules that are not directly covered by our code style should be discussed before.

If those rules are code style related, the matching section of the [Nextcloud developer documentation](https://github.com/nextcloud/documentation/) has to be updated to keep both in sync.

#### Rule severity

Either you care about a rule or you do not.
As such we only enforce rules that we consider either important for code quality or to have consistent code style.
For this reason all rules should be set to **error** severity, as all rules are considered must-follow.

Of course, in some edge cases rules do not apply, in such cases the users can still opt-in to disable that rule for a line or file.

To not break projects during updates new rules with non critical impact (code style related rules)
should be introduced with **warn** severity and moved to severity **error** only with a new major release or after a sane timeframe for migration.

#### Release new version

 1. Update CHANGELOG.md file with the latest changes
 2. Bump the package version with `npm version`
 3. Push version bump commit
 4. Create a new release with proper changelog https://github.com/nextcloud-libraries/eslint-config/releases/new
