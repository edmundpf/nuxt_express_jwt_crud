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
						<b-button v-b-modal.logout-modal>Logout</b-button>
					</b-nav-form>
				</b-navbar-nav>

			</b-collapse>
		</b-navbar>
		<logoutModal></logoutModal>
	</div>
</template>

<script>

import logoutModal from '~/components/logoutModal'

export default {

	data: function () {
		return {
			links: [
				{ title: 'User Auth', path: 'user_auth', primary_key: 'username', list_fields: false },
				{ title: 'Secret Key', path: 'secret_key', primary_key: 'key', list_fields: false },
				{ title: 'Customers', path: 'customer', primary_key: 'email', list_fields: ['products_purchased'] },
			]
		}
	},
	components: {
		logoutModal,
	},
	methods: {
		crudUrl(link) {
			return `/crud?model=${link.path}&key=${link.primary_key}&list=${link.list_fields}`;
		}
	}
}

</script>