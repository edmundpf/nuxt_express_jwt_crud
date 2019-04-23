# Nuxt/Express/MongoDB/JWT Database Admin Boilerplate

> Database admin starter code with Express backend API and Nuxt/Vue CRUD web app (**TO-DO: Add create/update/delete functionality, currently view-only)**. Includes universal create/update/get Express API endpoints for your MongoDB collections/schema, just add your schema to the project and edit the config. This can be useful for executing backend logic in different languages and using the API endpoints to manage your data. This data can be viewed from an admin perspective with the included Nuxt.js app with a few lines of configuration.

## Setup
* Install
	``` bash
	# Clone the repo
	$ git clone git@github.com:edmundpf/nuxt_express_jwt.git

	# Install the dependencies
	$ npm install
	```
* Secret Key setup
	* Save a secret key (encrypted by bcrypt) to protect your admin `/signup` endpoint
	* First, start the backend server
		``` bash
		# Open API folder
		$ cd data_api
		
		# Start Server
		$node index.js
		```
	* Navigate to `http://localhost:4000/secret_key/insert?key=YOUR_KEY_HERE` in your browser to save your key
		* Your key is set, remember this key
		* The `/update` route is not set to handle schemas with only one field, so to update your primary key, navigate to `/secret_key/delete_all` and then insert a new key
* Admin setup
	* To add an admin user that will be needed to use the web app and visit the API endpoints, navigate to `http://localhost:4000/signup?username=YOUR_USERNAME&password=YOUR_PASSWORD&secret_key=YOUR_SECRET_KEY`
	* To edit your secret key or admin credentials, see more info on the api endpoints here: [API Documentation](https://github.com/edmundpf/nuxt_express_jwt/blob/master/data_api/README.md)
* `package.json`
	* Edit title, author, email, etc. to fit the needs of your project
* Backend configuration
* API/Schema Configuration
	* Configure your API port, your Nuxt frontend CORS port, your MongoDB port, and your database name in *~/data_api/utils/server-config.js*
	* Add your schema to the *~/data_api/models* folder
		* As you will see in the example customer schema, all the models use timestamps and incrementing uid's as a standard
			``` javascript
			# The "id" field is the key for an internal *counters* collection, this must be unique from your other schema
			# The "inc_field" field is the key for the respective schema. *uid* is used throughout the framework for this field as a standard.
			customer.plugin(autoIncrement, { id: 'customer_uid', 
									inc_field: 'uid' });
			```
			* Read more about the *mongoose-sequence* package here: [Mongoose Sequence](https://github.com/ramiel/mongoose-sequence#readme)
	* Import your schema to the *~/data_api/utils/model-wrapper.js* file as shown with the customer example schema
		* If the schema contains fields with lists/arrays, add them inside of the *list_routes* object, if not, add these schema to the *normal_routes* object
			* This allows these list objects to have api routes for setting the whole list, or pushing to the list field
	* See more info at [Server/Schema Configuration](https://github.com/edmundpf/nuxt_express_jwt/blob/master/data_api/utils/README.md)
## Nuxt Configuration
	* Edit *~/components/navbar.vue* 
		* Add the link titles you would like to see in the navbar and the paths to your respective schema
			``` javascript
			data: function () {
			return {
				links: [
					{ title: 'Navbar Link Title Here', path 'api_path_here' },
					{ ... },
				]
			}
			},
		```
## Run Web App
	``` bash
	# Launch dev instance
	$ npm run dev
	
	# Run in production mode
	$ npm build
	$ npm start
	```
	* The credentials for the web app will be the credentials you added with the `/signup` endpoint earlier during backend configuration
	* The JSON Web Token has a 24 hour inactivity timeout until you will be logged off the web app\
## TO-DO
	* Add insert functionality
	* Add delete functionality
	* Add edit functionality
	* Add copy functionality
		
