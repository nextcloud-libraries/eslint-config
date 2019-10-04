/**
 * @fileoverview tbd
 * @author Christoph Wurst
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-deprecations"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-deprecations", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "OC.getHost()",
            errors: [{
                message: "The property or function OC.getHost was deprecated in Nextcloud 17.0.0",
                type: "MemberExpression"
            }]
        }
    ]
});
