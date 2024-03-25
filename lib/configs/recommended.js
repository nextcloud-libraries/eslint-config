"use strict";

module.exports = {
	env: {
		'@nextcloud/nextcloud': true
	},
	plugins: [
		'@nextcloud',
	],
	rules: {
		'@nextcloud/no-deprecations': ['warn', { parseAppInfo: true }],
		'@nextcloud/no-removed-apis': ['error', { parseAppInfo: true }],
	},
};
