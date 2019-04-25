const models = require('../models');
const schemaConfig = require('../config/schema-config.json');
const serverConfig = require('../config/server-config.json');

// SPECIAL MODELS //

const userAuth = models.userAuth
const secretKey = models.secretKey

// APP ROUTES //

// Get Schema Info

function schemaInfo(model, primary_key) {
	const schema = model.schema.paths
	const keys = Object.keys(schema)
	var list_keys = []
	for (const key of keys) {
		if (schema[key].$isMongooseArray != null && 
			schema[key].$isMongooseArray == true) {
				list_keys.push(key)
		}
	}
	return({ schema: keys, primary_key: primary_key, list_fields: list_keys })
}

// Get Routes

function getRoutes() {

	const list_routes = {};
	const normal_routes = {};
	const schemas = Object.keys(models);
	for (const schema of schemas) {
		const primary_key = schemaConfig[schema].primary_key;
		const schema_info = schemaInfo(eval(`models.${schema}`), primary_key);
		if (schema_info.list_fields.length > 0) {
			list_routes[schemaConfig[schema].path] = { model: eval(`models.${schema}`),
														primary_key: primary_key,
														list_fields: schema_info.list_fields }
		}
		else {
			normal_routes[schemaConfig[schema].path] = { model: eval(`models.${schema}`),
											primary_key: primary_key,
											list_fields: schema_info.list_fields }
		}
	}

	return { list: list_routes, normal: normal_routes }
}

const routes = getRoutes();
const list_routes = routes.list;
const normal_routes = routes.normal;
const app_routes = {...list_routes, ...normal_routes}

// ROUTE METHODS

const list_methods = ['set', 'push', 'push_unique']
const normal_methods = ['insert', 'update', 'delete', 'delete_all',
					 	'get', 'get_all', 'sterilize', 'schema']
const route_methods = [...normal_methods, ...list_methods]

// SERVER CONFIG

const serverPort = serverConfig.serverPort;
const corsPort = serverConfig.corsPort;
const mongoosePort = serverConfig.mongoosePort;
const databaseName = serverConfig.databaseName;

// EXPORTS //

module.exports = {
	userAuth, 
	secretKey,
	list_routes, 
	normal_routes, 
	app_routes, 
	list_methods, 
	normal_methods, 
	route_methods,
	serverPort,
	corsPort,
	mongoosePort,
	databaseName,
	schemaInfo,
}