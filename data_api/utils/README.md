# UTILS
## server-config.js
* Server config parameters
	* serverPort - API Port
	* corsPort - Allow CORS from this port
	* mongoosePort - MongoDB Port
	* databaseName - MongoDB Database Name
	* sk - Signup Key
## model-wrapper.js
* Import all schema for database
* Add models with list fields to *list_routes* and models with no list fields to *normal_routes*
	* Dict key will be the route url
	* model - Respective schema
	* primary_key - Respective primary key of model
* User model must be named *userAuth*