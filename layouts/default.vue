<template>
	<div>
		<navbar></navbar>
		<div>
			<nuxt/>
		</div>
	</div>
</template>

<script>

import navbar from '~/components/navbar'

export default {
	components: {
		navbar,
	}
}

</script>