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
})
