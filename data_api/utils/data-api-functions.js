const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const schemaInfo = require('./config-wrapper').schemaInfo;
const userAuth = require('./config-wrapper').userAuth;
const secretKey = require('./config-wrapper').secretKey;

const SECRET_KEY = uuid();

// Omit Properties from Object and get Copy

function objOmit(obj, keys) {
	var clone = Object.assign({}, obj);
	for (var i = 0; i < keys.length; i++) {
		delete obj[keys[i]];
	}
	return clone;
}

// Response/Error JSON

async function responseFormat(method, args, req, res) {
	try {
		var response = await method(...args);
		var ret_json = { status: 'ok', response: response };
		if (res.locals.refresh_token != null) {
			ret_json.refresh_token = res.locals.refresh_token;
		}
		return res.json(ret_json);
	}
	catch(error) {
		var err_json = { status: 'error', response: error };
		if (res.locals.refresh_token != null) {
			err_json.refresh_token = res.locals.refresh_token;
		}
		return res.status(500).json(err_json);
	}
}

// Update Query

function updateQuery(req, primary_key) {
	var update_query = objOmit(req.query, [primary_key])
	if (update_query.update_primary != null) {
		update_query[primary_key] = update_query.update_primary
		update_query.update_primary = null
	}
	return update_query
}

// Get Schema Info ASYNC

async function schemaAsync(model, primary_key) {
	return schemaInfo(model, primary_key)
}

// Incorrect Secret Key

function incorrectSecretKey(res) {
	return res.status(401).json({ status: 'error',
									response: { 
										message: 'Incorrect secret key.',
										codes: ['INCORRECT'],
									}
								})
}

// Incorrect Username or Password JSON

function incorrectUserOrPass(res) {
	return res.status(401).json({ status: 'error',
									response: { 
										message: 'Incorrect username or password.',
										codes: ['INCORRECT'],
									}
								})
}

// User Not Found JSON

function userNotFound(res) {
	return res.status(401).json({ status: 'error',
									response: { 
										message: 'User does not exist.',
										codes: ['USER_NOT_FOUND'],
									}
								})
}

// No Current Password JSON

function noCurrentPass(res) {
	return res.status(401).json({ status: 'error',
								response: { 
									message: 'Must include current password.',
									codes: ['NO_CURRENT_PASS'],
								}
							})
}

// Allowed Password Check

function allowedPassword(req, res) {

		var error_msg = '';
		var error_codes = [];

		if(req.query.username.length < 8) {
			error_msg += 'Username must be at least 8 characters. ';
			error_codes.push('USER_LENGTH');
		}
		if (req.query.password.length < 8) {
			error_msg += 'Password must be at least 8 characters. ';
			error_codes.push('PASS_LENGTH');
		}
		if (!/\d/.test(req.query.password)) {
			error_msg += 'Password must have at least 1 letter. ';
			error_codes.push('PASS_CHAR');
		}
		if (error_msg.length > 0) {
			error_msg = error_msg.substring(0, error_msg.length - 1);
			var error = { message: error_msg, codes: error_codes };
			return res.status(401).json({ status: 'error', response: error });
		}

}

// Sign JSON Web Token

function signToken(user) {
	const expires_in = 24 * 60 * 60;
	const access_token = jwt.sign({ username: user.username,
									uid: user.uid, }, 
									SECRET_KEY,
									{ expiresIn: expires_in });
	return { username: user.username, 
			uid: user.uid, 
			access_token: access_token,
			expires_in: expires_in };
}

// Verify JSON Web Token

async function verifyToken(req, res, next) {

	if (req.params.path != null) {
		if (req.params.path == 'secret_key') {
			const get_all = await secretKey.find({})
			if (get_all.length <= 0) {
				return next();
			}
		}
		else if (req.params.path == 'signup') {
			const get_all = await userAuth.find({})
			if (get_all.length <= 0) {
				return next();
			}
		}
	}
	var token = req.query.auth_token || req.headers['x-access-token'] ||
				req.headers['authorization'];
	if (!token) {
		return res.status(401).json({ status: 'error', response: { 
			message: 'No token provided.'}});
	}
	else {
		jwt.verify(token, SECRET_KEY, function(error, decoded) {

			const current_time = Math.round(Date.now() / 1000);
			const expires_in = 24 * 60 * 60;
			const one_hour = 60 * 60;

			if (error) {
				return res.status(401).json({ status: 'error', 
					response: { message: 'Invalid token.'}});
			}
			else if(current_time < decoded.exp && 
				(current_time + expires_in) > (decoded.exp + one_hour)) {
				res.locals.refresh_token = signToken(decoded);
				next();
			}
			else {
				next();
			}
		})
	}
}

// Exports

module.exports = {
	objOmit,
	responseFormat,
	schemaAsync,
	updateQuery,
	incorrectUserOrPass,
	userNotFound,
	noCurrentPass,
	allowedPassword,
	signToken,
	verifyToken,
}