"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const global = {
    fileDownloadPath: '15.0.0',
    getScrollBarWidth: '15.0.0',
}

const oc = {
    getScrollBarWidth: '15.0.0',
}

const oc_sub = {
    AppConfig: {
        hasKey: '15.0.0',
        deleteApp: '15.0.0',
    },
    Util: {
        hasSVGSupport: '15.0.0',
        replaceSVGIcon: '15.0.0',
        replaceSVG: '15.0.0',
        scaleFixForIE8: '15.0.0',
        isIE8: '15.0.0',
    },
}

// TODO: handle OC.x.y.z like OC.Share.ShareConfigModel.areAvatarsEnabled()
//       ref https://github.com/nextcloud/server/issues/11045

module.exports = {
    meta: {
        docs: {
            description: "Removed Nextcloud APIs",
            category: "Nextcloud",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {
        return {
            CallExpression: function (node) {
                // Globals
                if (global.hasOwnProperty(node.callee.name)) {
                    context.report(node, "The global property or function " + node.callee.name + " was removed in Nextcloud " + global[node.callee.name]);
                }
            },
            MemberExpression: function (node) {
                // Globals called with window.x
                if (node.object.name === 'window'
                    && global.hasOwnProperty(node.property.name)) {
                    context.report(node, "The global property or function " + node.property.name + " was removed in Nextcloud " + oc[node.property.name]);
                }

                // OC.x
                if (node.object.name === 'OC'
                    && oc.hasOwnProperty(node.property.name)) {
                    context.report(node, "The property or function OC." + node.property.name + " was removed in Nextcloud " + oc[node.property.name]);
                }

                // OC.x.y
                if (node.object.type === 'MemberExpression'
                    && node.object.object.name === 'OC'
                    && oc_sub.hasOwnProperty(node.object.property.name)
                    && oc_sub[node.object.property.name].hasOwnProperty(node.property.name)) {
                    const prop = [
                        "OC",
                        node.object.property.name,
                        node.property.name,
                    ].join('.');
                    const version = oc_sub[node.object.property.name][node.property.name]
                    context.report(node, "The property or function " + prop + " was removed in Nextcloud " + version);
                }
            }
        };
    }
};
