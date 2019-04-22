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
	* Save a secret key (encrypted by bcrypt) to protect your admin /signup endpoint
	* First, start the backend server
		``` bash
		# Open API folder
		$ cd data_api
		
		# Start Server
		$node index.js
		```
	* Navigate to `http://localhost:4000/secret_key/insert?key=YOUR_KEY_HERE` in your browser to save your key
		* Your key is set, remember this key
* Admin setup
	* To add an admin user that will be needed to use the web app/visit the API endpoints, navigate to `http://localhost:4000/signup?username=YOUR_USERNAME&password=YOUR_PASSWORD&secret_key=YOUR_SECRET_KEY`
	* Your admin user is added.
