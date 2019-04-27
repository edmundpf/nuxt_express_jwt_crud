# Nuxt/Express/MongoDB/JWT Admin CRUD Boilerplate
<img src="/assets/misc/crud.gif?raw=true"></img>
> Automatic Express API and CRUD web app for your MongoDB collections. Just add your schema to the *data_api/models* folder and run the included setup script to customize your configuration and add your admin credentials. All API endpoints and web app pages are protected by JSON Web Token authentification automatically.
## Setup
* Install
	``` bash
	# Clone the repo
	$ git clone git@github.com:edmundpf/nuxt_express_jwt.git

	# Install the dependencies
	$ npm install
	```
## CLI Configuration
![CLI Setup](https://i.imgur.com/se8ewac.gif "CLI Setup")
* Using the CLI
	``` bash
	# First you'll need to start your API server
	$ node data_api/index.js
	# Start the setup script
	$ node setup.js
	```
	* **NOTE:** your mongoDB server will need to be running to use the API, CLI, and web app
	* You'll need to set up a secret key to create an admin user
		* Select option (3) and set up your key
	* You'll need to add an admin user to access the web app
		* Select option (4) to create an admin account
	* Your secret keys and admin passwords are encrypted via bcrypt by default
	* If you added or removed any schema in the *data_api/models* folder, you'll need to configure the database schema
		* Select option (2) to configure your database schema
		* **DO NOT** rename or edit the *userAuth* or *secretKey* schema. These are essential for your admin access and could break the web app and API if they are renamed/edited.
	* All of the app configuration can be edited via option (1), but the app will run with the included defaults
		* The configuration includes options for your package such as package name, version, your name and email, etc.
		* It also includes your API server port, web app port, database port, database name, and your web page titles
	* You can clear your admin accounts and secret keys via option (5)
## Run Web App
* When using the web app you can shut off your API server, the web app will automatically launch it as server middleware
* Launch as shown below...
	``` bash
	# Launch dev instance
	$ npm run dev

	# Run in production mode
	$ npm build
	$ npm start
	```
	* Use the credentials you created with the CLI to login
	* The JSON Web Token has a 24 hour inactivity timeout until you will be logged off of the web app/API
		* You'll need to login again to get a new token
	* **NOTE:** You'll have access to edit your user auth schema in the web app. The API expects usernames of at least 8 characters, and passwords of at least 8 characters with at least one number. These rules do not exist in the web app so can cause unexpected behavior upon API/web app login if not followed. To enforce these rules, use the `/update_password` endpoint of the API to update your admin credentials, see more info on the API below. 
	* **TO-DO:** add update admin credentials option to setup CLI.
## API Routes
* Use any language of choice to edit your data and see the changes on the web app in real time
* [API Info](https://github.com/edmundpf/nuxt_express_jwt_crud/blob/master/data_api/README.md)
## Web App Info
* [Additional Web App Info](https://github.com/edmundpf/nuxt_express_jwt_crud/blob/master/pages/README.md)
## Schema Info
* [Included Schema Specs](https://github.com/edmundpf/nuxt_express_jwt_crud/blob/master/data_api/models/README.md)
* [Model Hooks Info](https://github.com/edmundpf/nuxt_express_jwt_crud/blob/master/data_api/utils/README.md)
