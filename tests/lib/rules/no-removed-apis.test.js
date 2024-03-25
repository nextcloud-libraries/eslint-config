/**
 * @fileoverview Removed Nextcloud APIs
 * @author Christoph Wurst
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-removed-apis")
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe('no-removed-api', () => {
    const ruleTester = new RuleTester();

    // Mocha tests
    ruleTester.run("no-removed-apis", rule, {
        valid: [
            {
                code: "var fileDownloadPath = require('fileDownloadPath'); fileDownloadPath(123);"
            }
        ],

        invalid: [
            {
                code: "OC.Util.isIE8()",
                errors: [{
                    message: "The property or function OC.Util.isIE8 was removed in Nextcloud 15.0.0",
                    type: "MemberExpression"
                }]
            },
            {
                code: "fileDownloadPath()",
                errors: [{
                    message: "The global property or function fileDownloadPath was removed in Nextcloud 15.0.0",
                    type: "Identifier"
                }]
            },
            {
                code: "OC.addTranslations()",
                errors: [{
                    message: "The property or function OC.addTranslations was removed in Nextcloud 26.0.0",
                    type: "MemberExpression"
                }]
            }
        ]
    })

    ruleTester.run('no-removed-api (with target version parsing)', rule, {
        valid: [
            // Removed in 26, but accept if our target is 25
            {
                name: 'manual target version lower than removed',
                code: 'OC.addTranslations()',
                options: [{ targetVersion: '25.0.0' }],
            },
            {
                name: 'appinfo max-version lower than removed',
                code: 'OC.addTranslations()',
                // enable appinfo parsing for testing only the target versions
                options: [{ parseAppInfo: true }],
                filename: 'tests/fixtures/valid-appinfo/some-file.js',
            },
        ],
    
        invalid: [
            // Removed in 26, so also fail if target is set to 26
            {
                name: 'manual target version equals removed',
                code: 'OC.addTranslations()',
                options: [{ targetVersion: '26.0.0' }],
                errors: [
                    {
                        message: 'The property or function OC.addTranslations was removed in Nextcloud 26.0.0',
                        type: 'MemberExpression',
                    },
                ],
            },
            {
                name: 'manual target version greater than removed',
                code: 'OC.addTranslations()',
                options: [{ targetVersion: '27.0.0' }],
                errors: [
                    {
                        message: 'The property or function OC.addTranslations was removed in Nextcloud 26.0.0',
                        type: 'MemberExpression',
                    },
                ],
            },
        ],
    })
})
