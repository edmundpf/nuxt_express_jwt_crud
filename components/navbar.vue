<template>
	<div>
		<b-navbar toggleable="lg" type="dark" variant="primary">
			<b-navbar-brand href="/">Home</b-navbar-brand>
			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
			<b-collapse v-if="$store.state.logged_in" id="nav-collapse" is-nav>

				<b-navbar-nav>
					<b-nav-item-dropdown text="Data" left>
						<b-dropdown-item v-for="link in links" v-bind:key="link" :href="crudUrl(link.path)">{{ link.title }}</b-dropdown-item>
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
				{ title: 'User Auth', path: 'user_auth' },
				{ title: 'Reddit Users', path: 'reddit_user'},
				{ title: 'Twitter Users', path: 'twitter_user'},
				{ title: 'Reddit Submissions', path: 'reddit_submission'},
				{ title: 'Account Listing', path: 'account_listing'},
			]
		}
	},
	components: {
		logoutModal,
	},
	methods: {
		crudUrl(path) {
			return `/crud?model=${path}`;
		}
	}
}

</script>