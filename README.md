# eslint-plugin-nextcloud

Nextcloud lint plugin for ESLint

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-nextcloud`:

```
$ npm install eslint-plugin-nextcloud --save-dev
```

## Usage

Add `nextcloud` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "nextcloud"
    ]
}
```


Then add the Nextcloud environment if you want to use global variables defined by Nextcloud server.

```json
{
    "env": {
        "nextcloud/nextcloud": true,
    }
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "nextcloud/no-deprecations": "warn",
        "nextcloud/no-removed-apis": "error",
    }
}
```

## Supported Environments

* `nextcloud/nextcloud`: Manifests global variables defined by Nextcloud server


## Supported Rules

* `nextcloud/no-deprecations`: Detects properties and functions that were deprecated in Nextcloud server
* `nextcloud/no-removed-apis`: Detects previously available APIs that were removed from Nextcloud server

