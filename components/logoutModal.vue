<template>
	<b-modal 
		id="logout-modal"
		v-model="modalShow"
		title="Logout" 
		ok-variant="danger"
		cancel-variant="secondary" 
		ok-title="Logout"
		@ok="submitEvent">
		Are you sure you want to logout?
	</b-modal>
</template>

<script>

export default {

	data: function () {
		return {
			modalShow: false,
		}
	},

	methods : {
		async submitEvent(evt) {
			evt.preventDefault()
			await this.$store.dispatch('setState', { username: '',
													logged_in: false,
													access_token: '' })
			await this.$axios.setToken('')
			this.modalShow = false
			this.$router.push('/login')
		}
	},
	
}

</script>