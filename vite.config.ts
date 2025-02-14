import { createLibConfig } from "@nextcloud/vite-config"

export default createLibConfig({
	index: 'lib/index.ts',
}, {
	libraryFormats: ['cjs', 'es'],
	thirdPartyLicense: false,
	DTSPluginOptions: { rollupTypes: true },
	// Make the package version available for the plugin meta
	replace: {
		__PACKAGE_VERSION__: JSON.stringify(process.env.npm_package_version),
	},
})
