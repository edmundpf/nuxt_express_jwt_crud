import webConfig from './assets/json/webConfig.json'
module.exports = {
	
	// Page Headers

	server: {
		port: webConfig.port,
	},

	head: {
		title: webConfig.site_title,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: webConfig.site_desc }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	// Mode

	mode: 'spa',

	// Modules

	modules: ['bootstrap-vue/nuxt',
				'@nuxtjs/axios',],

	// Servers

	serverMiddleware: [
		'~/data_api/index.js',
	],

	// Bootstrap Vue

	bootstrapVue: {
		bootstrapCSS: false,
		bootstrapVueCSS: false
	},

	// CSS

	css: [
		{ src: '~/assets/css/custom.scss', lang: 'scss' },
	],
	
	// Progress Bar Color

	loading: { color: '#3B8070' },
	
	// Build Configuration

	build: {
		
		// ESLint on Save

		extend (config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
		}
	}
}

