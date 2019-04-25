<template>
	<div>
		<b-navbar toggleable="lg" type="dark" variant="primary">
			<b-navbar-brand href="/">Home</b-navbar-brand>
			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse v-if="$store.state.logged_in" id="nav-collapse" is-nav>

				<b-navbar-nav>
					<b-nav-item-dropdown text="Data" left>
						<b-dropdown-item v-for="link in links" v-bind:key="link.path" :href="crudUrl(link)">{{ link.title }}</b-dropdown-item>
					</b-nav-item-dropdown>
				</b-navbar-nav>

				<b-navbar-nav class="ml-auto">
					<b-nav-form>
						<b-button v-b-modal.logout-modal class="nav-button">Logout</b-button>
					</b-nav-form>
				</b-navbar-nav>

			</b-collapse>
		</b-navbar>
		<logoutModal></logoutModal>
	</div>
</template>

<script>

import logoutModal from '~/components/logoutModal'
import schemaConfig from '~/data_api/config/schema-config.json'
import { startCase, camelCase } from 'lodash'

export default {

	data: function () {

		const configKeys = Object.keys(schemaConfig);
		var links = []
		for (const key of configKeys) {
			links.push({ title: startCase(camelCase(schemaConfig[key].path)), 
						path: schemaConfig[key].path })
		}

		return {
			links,
		}
	},
	components: {
		logoutModal,
	},
	methods: {
		crudUrl(link) {
			return `/crud?model=${link.path}`;
		}
	}
}

</script>