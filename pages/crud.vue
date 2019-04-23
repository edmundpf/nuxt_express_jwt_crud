<template>
	<b-container>

			<b-alert 
				:show="dismissCountDown"
				@dismiss-count-down="countDownChanged"
				variant="success" 
				dismissible 
				class="mt-3">
				{{ this.feedbackMessage }}
			</b-alert>

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

			<b-col md="6" class="my-1">
				<b-form-group label-cols-sm="3" label="Insert record" class="mb-0">
					<b-button @click="createButton($event.target)" class="mr-1" variant="success">
						Create
					</b-button>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row align-h="center" class="mt-3">

			<b-table 
				striped 
				hover 
				bordered 
				show-empty
				small
				responsive
				class="table-condensed mb-5"
				:items="items"
				:current-page="currentPage"
				:per-page="perPage"
				:filter="filter"
				:sort-by.sync="sortBy"
				:sort-direction="sortDirection"
				:fields="fields"
				@filtered="onFiltered">

				<template slot="actions" slot-scope="row">
					<b-button size="sm" @click="editButton(row.item, row.index, $event.target)" class="mr-1" variant="warning">
						Edit
					</b-button>
					<b-button size="sm" @click="copyButton(row.item, row.index, $event.target)" class="mr-1" variant="info">
						Copy
					</b-button>
					<b-button size="sm" @click="deleteButton(row.item, row.index, $event.target)" class="mr-1" variant="danger">
						Delete
					</b-button>
				</template>

			</b-table>
		</b-row>

		<b-modal 
			:id="editModal.id" 
			:title="editModal.title" 
			v-model="editShow"
			size="lg"
			ok-variant="success"
			ok-title="Save"
			@ok="editEvent"
			@cancel="editCancel">
			<b-alert v-model="editAlert" variant="danger" dismissible>
				{{ this.feedbackMessage }}
			</b-alert>
			<b-form-group v-for="field in editFields" v-bind:key="field.key" label-cols-sm="3" :label="titleCase(field.key)" class="mb-3">
					<b-input-group>
						<b-form-input v-model="field.value" :disabled="field.primary"></b-form-input>
						<b-input-group-append v-if="field.list">
							<b-form-select
								class="mb-2 mr-sm-2 mb-sm-0"
								v-model="field.list_mode"
								:options="['Set', 'Push']"
								id="inline-form-custom-select-pref"
							></b-form-select>
						</b-input-group-append>
					</b-input-group>
			</b-form-group>
		</b-modal>

		<b-modal 
			:id="createModal.id" 
			:title="createModal.title" 
			v-model="createShow"
			size="lg"
			ok-variant="success"
			ok-title="Save"
			@ok="createEvent"
			@cancel="createCancel">
			<b-alert v-model="createAlert" variant="danger" dismissible>
				{{ this.feedbackMessage }}
			</b-alert>
			<b-form-group v-for="field in createFields" v-bind:key="field.key" label-cols-sm="3" :label="titleCase(field.key)" class="mb-3">
					<b-form-input v-model="field.value" :disabled="field.list"></b-form-input>
			</b-form-group>
		</b-modal>

		<b-modal 
			:id="deleteModal.id" 
			:title="deleteModal.title" 
			v-model="deleteShow"
			size="lg"
			ok-variant="danger"
			ok-title="Delete"
			@ok="deleteEvent"
			@cancel="deleteCancel">
			<b-alert v-model="deleteAlert" variant="danger" dismissible>
				{{ this.feedbackMessage }}
			</b-alert>
			<strong>Are you sure you want to delete the following record?</strong>			
			<pre>{{ deleteModal.content }}</pre>
		</b-modal>

	</b-container>
</template>

<script>

import { apiReq } from '~/plugins/misc-functions'
import format from 'date-fns/format'
import { startCase, camelCase } from 'lodash'

export default {

	data: function () {
		return {
			items: [],
			feedbackMessage: '',
			editAlert: false,
			createAlert: false,
			deleteAlert: false,
			dismissSecs: 3,
			dismissCountDown: 0,
			editShow: false,
			createShow: false,
			deleteShow: false,
			totalRows: 1,
			currentPage: 1,
			perPage: 5,
			pageOptions: [5, 10, 25, 50, 100],
			sortBy: null,
			sortDirection: 'asc',
			filter: null,
			fields: [],
			editFields: [],
			createFields: [],
			primary_key: null,
			primary_val: '',
			listKeys: [],
			allKeys: [],
			editModal: {
				id: 'edit-modal',
				title: '',
			},
			createModal: {
				id: 'create-modal',
				title: '',
			},
			deleteModal: {
				id: 'delete-modal',
				title: '',
				content: ''
			}
		}
	},
	async mounted() {
		await this.getAttributes();
		await this.apiReset();
	},
	methods: {
		async getAttributes() {
			const api_req = await apiReq(this, `${this.$route.query.model}/schema`)
			this.primary_key = api_req.response.primary_key
			this.listKeys = api_req.response.list_fields
			this.allKeys = api_req.response.schema
		},
		async apiReset() {

			this.fields = [];
			this.editFields = [];
			this.createFields = [];

			var items = await apiReq(this, `${this.$route.query.model}/get_all`)

			if (items.status == 'ok') {

				var delete_keys = ['_id', 'uid', '__v']

				for (const key of delete_keys) {
					const del_index = this.allKeys.indexOf(key)
					if (del_index >= 0) {
						this.allKeys.splice(this.allKeys.indexOf(key), 1)
					}
				}

				for (var i = items.response.length - 1; i >= 0; i--) {
					for (const key of this.allKeys) {
						if (this.listKeys.includes(key)) {
							items.response[i][key] = items.response[i][key].toString();
						}
						if (delete_keys.includes(key)) {
							delete items.response[i][key];
						}
					}
					items.response[i].createdAt = format(items.response[i].createdAt, 'YYYY/MM/DD HH:mm:ss');
					items.response[i].updatedAt = format(items.response[i].updatedAt, 'YYYY/MM/DD HH:mm:ss');
				}

				this.items = items.response;
				this.totalRows = this.items.length;

				for (const key of this.allKeys) {
					this.fields.push({ "key": key, "sortable": true });
					if (!['createdAt', 'updatedAt'].includes(key)) {

						var fields_dict = { "key": key, "value": '', "list_mode": 'Set' };
						if (this.listKeys.includes(key)) {
							fields_dict.list = true;
						}
						else {
							fields_dict.list = false;								
						}
						if (key == this.primary_key) {
							fields_dict.primary = true;
						}
						else {
							fields_dict.primary = false								
						}
						this.editFields.push(fields_dict);
						this.createFields.push(fields_dict);	
					}
				}
				if (this.fields.length > 0) {
					this.fields.push({ key: "actions", sortable: false });					
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
		},
		editButton(item, index, button) {
			this.editModal.title = `Edit row ${index}`
			this.populateForms(item, this.editFields)
			this.$root.$emit('bv::show::modal', this.editModal.id, button)
		},
		copyButton(item, index, button) {
			this.createModal.title = `Copy row ${index}`
			this.populateForms(item, this.createFields)
			this.$root.$emit('bv::show::modal', this.createModal.id, button)
		},
		createButton(button) {
			this.createModal.title = 'Create a new record'
			this.$root.$emit('bv::show::modal', this.createModal.id, button)
		},
		deleteButton(item, index, button) {
			this.deleteModal.title = `Delete row ${index}?`
			this.deleteModal.content = JSON.stringify(item, null, 2)
			this.$root.$emit('bv::show::modal', this.deleteModal.id, button)
			this.primary_val = item[this.primary_key]
		},
		resetModal(modal) {
			modal.title = ''
			modal.content = ''
			this.primary_val = ''
			this.editAlert = this.createAlert = this.deleteAlert = false
		},
		resetFormModal(modal, modalFields) {
			modal.title = ''
			for (var i = modalFields.length - 1; i >= 0; i--) {
				modalFields[i].value = '';
				modalFields[i].list_mode = 'Set';
			}
			this.editAlert = this.createAlert = this.deleteAlert = false
		},
		populateForms(item, modalFields) {
			const item_keys = Object.keys(item);
			for (const item_key of item_keys) {
				for (var i = modalFields.length - 1; i >= 0; i--) {
					if (modalFields[i].key == item_key) {
						modalFields[i].value = item[item_key];
					}
				}
			}
		},
		titleCase(string) {
			return startCase(camelCase(string));
		},
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown
		},
		createCancel(evt) {
			evt.preventDefault()
			this.createShow = false
			this.createAlert = false
			this.resetFormModal(this.createModal, this.createFields)
		},
		editCancel(evt) {
			evt.preventDefault()
			this.editShow = false
			this.editAlert = false
			this.resetFormModal(this.editModal, this.editFields)			
		},
		deleteCancel(evt) {
			evt.preventDefault()
			this.deleteShow = false
			this.deleteAlert = false
			this.resetModal(this.deleteModal)		
		},	
		async createEvent(evt) {
			evt.preventDefault()
			var create_dict = {}
			for (var i = this.createFields.length - 1; i >= 0; i--) {
				if (this.createFields[i].value != '') {
					create_dict[this.createFields[i].key] = this.createFields[i].value;
				}
			}
			if (Object.keys(create_dict).length > 0) {
				const api_req = await apiReq(this, `${this.$route.query.model}/insert`, create_dict)
				if (api_req.status == 'error') {
					if (api_req.response.message != null && api_req.response.message != '') {
						this.feedbackMessage = api_req.response.message
					}
					else {
						this.feedbackMessage = api_req.response.errmsg
					}
					this.createAlert = true
				}
				else if (api_req.status == 'ok') {
					await this.apiReset()
					this.createShow = false
					this.createAlert = false
					this.resetFormModal(this.createModal, this.createFields)
					this.feedbackMessage = 'Record created successfully'
					this.dismissCountDown = this.dismissSecs
				}
			}
		},
		async editEvent(evt) {
			evt.preventDefault()
			var edit_dict = {}
			var push_list = []
			var set_list = []
			for (var i = this.editFields.length - 1; i >= 0; i--) {
				if (this.editFields[i].value != '') {
					if (!this.editFields[i].list) {
						edit_dict[this.editFields[i].key] = this.editFields[i].value;
					}
					else {
						if (this.editFields[i].list_mode == 'Set') {
							set_list.push({ [this.editFields[i].key]: this.editFields[i].value })
						}
						else if (this.editFields[i].list_mode == 'Push') {
							push_list.push({ [this.editFields[i].key]: this.editFields[i].value })
						}
					}
				}
			}

			const actions = []
			if (Object.keys(edit_dict).length > 0) {
				actions.push({ action: 'update', dict: edit_dict })
			}
			for (var i = push_list.length - 1; i >= 0; i--) {
				push_list[i][this.primary_key] = edit_dict[this.primary_key]
				actions.push({ action: 'push', dict: push_list[i] })
			}
			for (var i = set_list.length - 1; i >= 0; i--) {
				set_list[i][this.primary_key] = edit_dict[this.primary_key]
				actions.push({ action: 'set', dict: set_list[i] })
			}

			this.feedbackMessage = ''
			var hasError = false
			for (var i = 0; i <= actions.length - 1; i++) {
				const api_req = await apiReq(this, `${this.$route.query.model}/${actions[i].action}`, actions[i].dict)
				if (api_req.status == 'error') {
					if (api_req.response.message != null && api_req.response.message != '') {
						this.feedbackMessage += api_req.response.message
					}
					else {
						this.feedbackMessage += api_req.response.errmsg
					}
					hasError = true
				}
				else if (api_req.status == 'ok') {
					if (i == (actions.length - 1)) {
						await this.apiReset()
						this.editShow = false
						this.editAlert = false
						this.resetFormModal(this.editModal, this.editFields)
						this.feedbackMessage = 'Record updated successfully'
						this.dismissCountDown = this.dismissSecs
						return
					}
				}
			}
			if (hasError) {
				this.editAlert = true
			}
		},
		async deleteEvent(evt) {
			var delete_dict = { [this.primary_key]: this.primary_val }
			if (delete_dict[this.primary_key] != null) {
				const api_req = await apiReq(this, `${this.$route.query.model}/delete`, delete_dict)
				if (api_req.status == 'error') {
					if (api_req.response.message != null && api_req.response.message != '') {
						this.feedbackMessage = api_req.response.message
					}
					else {
						this.feedbackMessage = api_req.response.errmsg
					}
					this.deleteAlert = true
				}
				else if (api_req.status == 'ok') {
					await this.apiReset()
					this.deleteShow = false
					this.deleteAlert = false
					this.resetModal(this.deleteModal)
					this.feedbackMessage = 'Record deleted successfully'
					this.dismissCountDown = this.dismissSecs
				}
			}
		},
	},
	middleware: ['authToken'],
}

</script>