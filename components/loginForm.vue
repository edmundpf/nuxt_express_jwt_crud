<template>
		<b-container>
			<b-row class="mt-5" align-h="center">
				<b-col md="6">
					<b-card
						border-variant="primary"
						header="Login"
						bg-variant="light"
						header-bg-variant="primary"
						header-text-variant="white">

						<b-form @submit="onSubmit">

							<b-alert v-model="showAlert" variant="danger" dismissible>
								{{ this.errorMessage }}
							</b-alert>

							<b-form @submit="onSubmit">
								<b-form-row>
									<label for="feedback-user">Username</label>
									<b-input v-model="userId" :state="userValidation" id="feedback-user"></b-input>
									<b-form-invalid-feedback :state="userValidation">
										Your username must be at least 8 characters long.
									</b-form-invalid-feedback>
									<b-form-valid-feedback :state="userValidation">
										Looks good.
									</b-form-valid-feedback>
								</b-form-row>
							</b-form>

							<b-form @submit="onSubmit">
								<b-form-row class="mt-3">
									<label for="feedback-pass">Password</label>
									<b-input v-model="userPass" :state="passValidation" id="feedback-pass" type="password"></b-input>
									<b-form-invalid-feedback :state="passValidation">
										{{ this.passFeedback }}
									</b-form-invalid-feedback>
									<b-form-valid-feedback :state="passValidation">
										Looks good.
									</b-form-valid-feedback>
								</b-form-row>
							</b-form>
							<b-form-row class="mt-3">
								<b-button type="submit" variant="primary" :disabled="!loginValidation">Submit</b-button>
							</b-form-row>
						</b-form>

					</b-card>
				</b-col>
			</b-row>
		</b-container>
</template>

<script>

import { apiReq } from '~/plugins/misc-functions'

export default {

	data: function () {
		return {
			userId: '',
			userPass: '',
			passFeedback: '',
			errorMessage: '',
			showAlert: false,
		}
	},

	computed: {
		userValidation() {
			if (this.userId.length == 0) {
				return null
			}
			return this.userId.length >= 8
		},
		passValidation() {
			return this.passFeedbackString()
		},
		loginValidation() {
			if (this.userValidation == null || this.passValidation == null) {
				return false
			}
			else {
				return this.userValidation && this.passValidation
			}
		},
	},

	methods : {
		passFeedbackString() {
			if (this.userPass.length == 0) {
				return null
			}
			if (this.userPass.length < 8 && !/\d/.test(this.userPass)) {
				this.passFeedback = 'Your password must be at least 8 characters long and must contain at least 1 number.'
			}
			else if (this.userPass.length < 8 && /\d/.test(this.userPass)) {
				this.passFeedback = 'Your password must be at least 8 characters long.'
			}
			else if (!this.userPass.length < 8 && !/\d/.test(this.userPass)) {
				this.passFeedback = 'Your password must contain at least 1 number.'
			}
			return this.userPass.length >= 8 && /\d/.test(this.userPass)
		},
		async onSubmit(evt) {
			evt.preventDefault()
			var loginReq = await apiReq(this, 'login', { username: this.userId, 
														password: this.userPass });
			if (loginReq.status == 'error') {
				if (loginReq.response.message != null && loginReq.response.message != '') {
					this.errorMessage = loginReq.response.message
				}
				else {
					this.errorMessage = 'Login failed. Please try again.'
				}
				this.showAlert = true
			}
			else if (loginReq.status == 'ok') {
				await this.$store.dispatch('setState', { username: loginReq.response.username,
													logged_in: true,
													access_token: loginReq.response.access_token })
				await this.$axios.setToken(loginReq.response.access_token)
				this.$router.push('/')
			}
		},
	},
	
}

</script>