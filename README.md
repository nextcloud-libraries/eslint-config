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

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-nextcloud` globally.

## Usage

Add `nextcloud` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "nextcloud"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "nextcloud/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





