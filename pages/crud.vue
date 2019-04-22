<template>
	<b-container>

		<b-row class="mt-5">
			<b-col md="6" class="my-1">
				<b-form-group label-cols-sm="3" label="Filter" class="mb-0">
					<b-input-group>
						<b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
						<b-input-group-append>
							<b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
						</b-input-group-append>
					</b-input-group>
				</b-form-group>
			</b-col>

			<b-col md="6" class="my-1">
				<b-form-group label-cols-sm="3" label="Per page" class="mb-0">
					<b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row>
			<b-col md="6" class="my-1">
				<b-form-group label-cols-sm="3" label="Page" class="mb-0">
					<b-pagination
						v-model="currentPage"
						:total-rows="totalRows"
						:per-page="perPage"
						class="my-0"
					></b-pagination>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row align-h="center" class="mt-3">
			<b-alert v-model="showAlert" variant="danger" dismissible>
				{{ this.errorMessage }}
			</b-alert>

			<b-table 
				striped 
				hover 
				bordered 
				show-empty
				small
				responsive
				class="table-condensed"
				:items="items"
				:current-page="currentPage"
				:per-page="perPage"
				:filter="filter"
				:sort-by.sync="sortBy"
				:sort-direction="sortDirection"
				:fields="fields"
				@filtered="onFiltered"
			></b-table>
		</b-row>
	</b-container>
</template>

<script>

import { apiReq } from '~/plugins/misc-functions'
import format from 'date-fns/format'

export default {

	data: function () {
		return {
			items: [],
			errorMessage: '',
			showAlert: false,
			totalRows: 1,
			currentPage: 1,
			perPage: 5,
			pageOptions: [5, 10, 25, 50, 100],
			sortBy: null,
			sortDirection: 'asc',
			filter: null,
			fields: [],
		}
	},
	async mounted() {
		await this.apiReset();
	},
	methods: {
		async apiReset() {
			var items = await apiReq(this, `${this.$route.query.model}/get_all`)
			if (items.status == 'ok') {
				var delete_keys = ['_id', 'uid', '__v']
				for (var i = items.response.length - 1; i >= 0; i--) {
					for (const key of delete_keys) {
						delete items.response[i][key];
					}
					items.response[i].createdAt = format(items.response[i].createdAt, 'YYYY/MM/DD HH:mm:ss');
					items.response[i].updatedAt = format(items.response[i].createdAt, 'YYYY/MM/DD HH:mm:ss');
				}
				this.items = items.response;
				this.totalRows = items.length;
				if (this.items.length > 0) {
					var fields_temp = Object.keys(this.items[0])
					for (const key of fields_temp) {
						this.fields.push({ "key": key, "sortable": true })
					}
				}
			}
			else {
				if (items.response.message != null && items.response.message != '') {
					this.errorMessage = items.response.message;
				}
				else {
					this.errorMessage = 'Could not fetch table data.'
				}
				this.showAlert = true;
			}
		},
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		}
	},
	middleware: ['authToken'],
}

</script>