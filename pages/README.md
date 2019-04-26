# PAGES

This directory contains your Application Views and Routes.
The framework reads all the .vue files inside this directory and creates the router of your application.

More information about the usage of this directory in the documentation:
https://nuxtjs.org/guide/routing

## Included functionality
* Login
* Logout
* Create records
* Update records
	* Includes Set, Push, and Push Unique functionality for array fields
		* Set - sets/overwrites array values via comma-separated-values i.e. `1,2,3`
		* Push - pushes array values onto array
		* Push Unique - pushes values onto array if they don't exist already
			* **NOTE** - this DOES NOT delete existing duplicates, it only applies to the records being pushed
* Delete records
* View records
## Opinionated Setup
* Mongoose collections always include *_id* and *__v* fields per default, and the included schema contain incrementing *uid* fields
* By default these fields are hidden in the web app
	* To include these fields, add or remove fields per taste in the *delete_keys* array on line 229 of crud.vue
	* `var delete_keys = ['_id', 'uid', '__v']`
* By default, any field named *"password"* will be masked with dots when editing/deleting
	* To change this, remove the v-if, v-else and password type from both the Edit Modal and Create Modal on lines 105-106 and 132-133 respectively of crud.vue
	* This...
		``` javascript
		<b-form-input v-model="field.value" v-if="isPassword(field)" type="password"></b-form-input>
		<b-form-input v-model="field.value" v-else></b-form-input>
		```
	* To this...
		``` javascript
		<b-form-input v-model="field.value"></b-form-input>
		```
