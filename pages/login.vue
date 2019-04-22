<template>
	
	<loginForm></loginForm>
	
</template>

<script>

import loginForm from '~/components/loginForm'

export default {
	components: {
		loginForm,
	},
	middleware: 'authenticated',
}
</script>