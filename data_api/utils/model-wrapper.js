// SCHEMAS //

const customer = require('../models/customer.js');
const userAuth = require('../models/user-auth.js')

// APP ROUTES //

const list_routes = {'customer': {
					'model': customer,
					'primary_key': 'email',
					},
				}

const normal_routes = {'user_auth': {
						'model': userAuth,
						'primary_key': 'username',
						},
					}

const app_routes = {...list_routes, ...normal_routes}

// ROUTE METHODS

const list_methods = ['push', 'set']
const normal_methods = ['insert', 'update', 'delete',
					 'delete_all', 'get', 'get_all', 'sterilize']

const route_methods = [...normal_methods, ...list_methods]

// EXPORTS //

module.exports = {
	userAuth, 
	list_routes, 
	normal_routes, 
	app_routes, 
	list_methods, 
	normal_methods, 
	route_methods
}