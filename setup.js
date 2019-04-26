var inquirer = require('inquirer')
const jsonfile = require('jsonfile')
const editJson = require('edit-json-file')
const snakeCase = require('lodash').snakeCase
const request = require('request-promise');
const models = require('./data_api/models')

const packageConfig = require('./package.json')
const webConfig = require('./assets/json/webConfig.json')
const schemaConfig = require('./data_api/config/schema-config.json')
const serverConfig = require('./data_api/config/server-config.json')

var REQUEST_CONFIG = {
	username: '',
	password: '',
	token: '',
	port: serverConfig.serverPort,
}

// METHODS //

// Get Action

async function getAction() {

	const choices = {
						configApp: 'Configure API/Web App',
						configSchema: 'Configure Database Schema',
						setSecret: 'Set up a secret key',
						createAdmin: 'Create an admin account',
						resetAdmin: 'Reset admin accounts and secret key',
					}
	const answer = await inquirer.prompt([
		{ 
			type: 'rawlist',
			name: 'action',
			message: 'What would you like to do?',
			choices: Object.values(choices)
		}
	])

	for (const choice of Object.keys(choices)) {
		if (choices[choice] == answer.action) {
			eval(`${choice}()`)
		}
	}
}

// Configure API/Web App

async function configApp() {

	print('Hit enter to use current values.')

	const answer = await inquirer.prompt([
		{ 
			type: 'input',
			name: 'package_name',
			message: 'Enter a package name:',
			default: packageConfig.name,
		},
		{ 
			type: 'input',
			name: 'package_version',
			message: 'Enter package version:',
			default: packageConfig.version,
		},
		{ 
			type: 'input',
			name: 'package_description',
			message: 'Enter package description:',
			default: packageConfig.description
		},
		{ 
			type: 'input',
			name: 'package_author_name',
			message: 'Enter author name:',
			default: authorName(packageConfig.author),
		},
		{ 
			type: 'input',
			name: 'package_author_email',
			message: 'Enter author email:',
			default: authorEmail(packageConfig.author),
		},
		{ 
			type: 'list',
			name: 'package_private',
			message: 'Is this package private or public?',
			choices: [
				{
					name: 'Private',
					value: true,
				},
				{
					name: 'Public',
					value: false,
				}
			],
		},
		{ 
			type: 'input',
			name: 'server_serverPort',
			message: 'Enter backend API port:',
			validate: isNumber,
			filter: getNumber,
			default: serverConfig.serverPort,
		},
		{ 
			type: 'input',
			name: 'server_corsPort',
			message: 'Enter web app port:',
			validate: isNumber,
			filter: getNumber,
			default: serverConfig.corsPort,
		},
		{ 
			type: 'input',
			name: 'server_mongoosePort',
			message: 'Enter MongoDB port:',
			validate: isNumber,
			filter: getNumber,
			default: serverConfig.mongoosePort,
		},
		{ 
			type: 'input',
			name: 'server_databaseName',
			message: 'Enter MongoDB database name:',
			default: serverConfig.databaseName,
		},
		{ 
			type: 'input',
			name: 'web_site_title',
			message: 'Enter website name to display in title bar:',
			default: webConfig.site_title,
		},
		{ 
			type: 'input',
			name: 'web_site_desc',
			message: 'Enter website description:',
			default: webConfig.site_desc,
		},
	])

	var api_temp_port = REQUEST_CONFIG.port
	var update_map = { 
						package: {},
						server: {},
						web: {},
					}

	update_map.package.author = `${answer.package_author_name} <${answer.package_author_email}>`
	update_map.web.port = answer.server_corsPort

	for (const field of Object.keys(answer)) {
		var update_type = field.slice(0, field.indexOf('_'))
		var update_key = field.slice(field.indexOf('_') + 1)
		if (!['author_name', 'author_email'].includes(update_key)) {
			if (update_key == 'serverPort') {
				api_temp_port = answer[field]
			}
			update_map[update_type][update_key] = answer[field]
		}
	}

	try {
		await jsonfile.writeFile('./assets/json/webConfig.json', 
								update_map.web, { spaces: 2, EOL: '\r\n' })
		print('Saved web config changes.', 'success')
	}
	catch {
		print('Could not save web config changes.', 'danger')
	}

	updateJSON('./package.json', 'package config', update_map.package)
	if (updateJSON('./data_api/config/server-config.json', 'server config', update_map.server)) {
		REQUEST_CONFIG.port = api_temp_port
	}
	
	await exitPrompt()

}

// Configure Schema

async function configSchema() {

	var prompts = []
	const schemas = Object.keys(models)
	const cur_schemas = Object.keys(schemaConfig)

	for (const schema of schemas) {

		var schema_defs = {}
		if (cur_schemas.includes(schema)) {
			schema_defs = { path: schemaConfig[schema].path, 
									key: schemaConfig[schema].primary_key }
		}
		else {
			schema_defs = { path: snakeCase(schema), key: null }
		}

		if (!['userAuth', 'secretKey'].includes(schema)) {
			prompts.push(
			{
				type: 'input',
				name: `${schema}_path`,
				message: `Enter "${schema}" web path:`,
				default: schema_defs.path,
			},
			{
				type: 'input',
				name: `${schema}_primary_key`,
				message: `Enter "${schema}" primary key:`,
				default: schema_defs.key,
			})
		}
	}

	const answer = await inquirer.prompt(prompts)

	const update_map = {}

	for (const field of Object.keys(answer)) {
		var update_type = field.slice(0, field.indexOf('_'))
		var update_key = field.slice(field.indexOf('_') + 1)
		if (update_map[update_type] == null) {
			update_map[update_type] = { [update_key]: answer[field] }
		}
		else {
			update_map[update_type][update_key] = answer[field]
		}
	}

	updateJSON('./data_api/config/schema-config.json', 'schema config', update_map)

	await exitPrompt()

}

// Set Secret Key

async function setSecret() {

	try {

		if (REQUEST_CONFIG.token == '') {

			try {
				const req = await request({
					method: 'GET',
					uri: `http://localhost:${REQUEST_CONFIG.port}/secret_key/get_all`,
					json: true,
				})
				if (req.status == 'ok') {
					if (await secretKey()) { return }
					else { return await tryAgain(setSecret) }
				}
			}
			catch (err) {
				print('This API endpoint is protected since a secret key has already been set up. You must log in to change your secret key.')
			}
	
			if (await login()) {
				if (await secretKey()) { return }
				else { return await tryAgain(setSecret) }
			}
		}
		else if (REQUEST_CONFIG.token != '') {
			if (await secretKey()) { return }
			else { return await tryAgain(setSecret) }
		}
	}
	catch (err) {
		if (err.error.response != null && 
			err.error.response.message != null && 
			err.error.response.message == 'No token provided.') {
				protectedMessage()
		}
		else { 
			print('Could not set secret key.', 'danger')
		}
	}

}

// Set Secret Key Routine

async function secretKey() {

	var key_match = false
	var answer
	while (!key_match) {
		answer = await inquirer.prompt([
			{ 
				type: 'password',
				name: 'secret1',
				message: 'Enter your secret key (shh):',
				mask: true,
			},
			{ 
				type: 'password',
				name: 'secret2',
				message: 'Confirm your secret key:',
				mask: true,
			},
		])

		key_match = (answer.secret1 == answer.secret2)
		if (!key_match) {
			print('Keys do not match! Please try again.', 'danger')
		}
	}

	const req = await request({
		method: 'GET',
		uri: `http://localhost:${REQUEST_CONFIG.port}/secret_key/insert?key=${answer.secret1}`,
		headers: { 'authorization': REQUEST_CONFIG.token },
		json: true,
	})

	if (req.status == 'ok') {
		print('Set new secret key.', 'success')
		await exitPrompt()
		return true
	}
	else {
		print('Could not set secret key.', 'danger')
		console.log(req.response)
		return false
	}
}

// Create Admin Account

async function createAdmin() {

	const answer = await inquirer.prompt([
		{ 
			type: 'password',
			name: 'secret_key',
			message: 'Enter your secret key:',
			mask: true,
		},
		{ 
			type: 'input',
			name: 'username',
			message: 'Enter username:',
		},
		{ 
			type: 'input',
			name: 'password1',
			message: 'Enter password:',
		},
		{ 
			type: 'input',
			name: 'password2',
			message: 'Confirm password:',
		},
	])

	console.log(answer)
	await exitPrompt()

}

// Reset Admin Accounts

async function resetAdmin() {

	print('This will delete all your admin account credentials.')

	const answer = await inquirer.prompt([
		{ 
			type: 'list',
			name: 'delete',
			message: 'Do you want to clear all admin credentials?',
			choices: ['Yes', 'No']
		},
	])

	console.log(answer)
	if (answer.delete == 'No') {
		await exitPrompt()
	}
	else {
		await surePrompt()
	}

}

// Login

async function login() {

	print('Login to your admin account.')

	try {

		const answer = await inquirer.prompt([
			{
				type: 'input',
				name: 'username',
				message: 'Enter your username:'
			},
			{ 
				type: 'password',
				name: 'password',
				message: 'Enter your password:',
				mask: true,
			},
		])

		const req = await request({
			method: 'GET',
			uri: `http://localhost:${REQUEST_CONFIG.port}/login?username=${answer.username}&password=${answer.password}`,
			json: true,
		})

		if (req.status == 'ok') {
			REQUEST_CONFIG.username = req.response.username
			REQUEST_CONFIG.password = answer.pass1
			REQUEST_CONFIG.token = req.response.access_token
			print('Logged in successfully.', 'success')
			return true
		}
		else {
			print('Could not login.', 'danger')
			return await tryAgain(login)
		}

	}

	catch (err) {
		if (err.error.response != null && err.error.response.message != null) {
			print(err.error.response.message, 'danger') 
		}
		else {
			print('Could not login.', 'danger')
		}
		return await tryAgain(login)
	}

}

// Are you sure prompt

async function surePrompt(action) {

	const answer = await inquirer.prompt([
		{ 
			type: 'list',
			name: 'sure',
			message: 'Are you sure?',
			choices: ['Yes', 'No']
		},
	])

	console.log(answer)
	await exitPrompt()

}

// Try again prompt

async function tryAgain(action) {

	const answer = await inquirer.prompt([
		{ 
			type: 'list',
			name: 'again',
			message: 'Would you like to try again?',
			choices: ['Yes', 'No']
		},
	])

	if (answer.again == 'Yes') {
		return await action()
	}
	else {
		await exitPrompt()
		return false
	}

}

// Exit Prompt

async function exitPrompt() {

	const answer = await inquirer.prompt([
		{ 
			type: 'list',
			name: 'exit',
			message: 'Would you like to do something else or exit?:',
			choices: ['Do something else', 'Exit'],
		},
	])

	if (answer.exit == 'Exit') {
		print('Goodbye.')
	}
	else {
		await getAction()
	}

}

// Protected Message

function protectedMessage() {
	print('This API endpoint is protected by JWT because you already set up a secret key. ' +
			"You'll need to log in here or in the web app to edit your existing secret key. " +
			"If you forgot your credentials, you'll need to reset your accounts and secret key via CLI option 5.", 
				'danger')
}

// Print

function print(text, type) {
	if (type == null) {
		console.log(`\x1b[1m> ${text}\x1b[0m`)
	}
	else if (type == 'success') {
		console.log(`\x1b[32m\x1b[1m> ${text}\x1b[0m`)
	}
	else if (type == 'danger') {
		console.log(`\x1b[31m\x1b[1m> ${text}\x1b[0m`)
	}
}

// Update JSON File

function updateJSON(filename, title, dict) {
	try {
		const file = editJson(filename, { autosave: true })
		for (const key of Object.keys(dict)) {
			file.set(key, dict[key])
		}
		print(`Saved ${title} changes.`, 'success')
		return true
	}
	catch (error) {
		print(`Could not update ${title}.`)
		return false
	}
}

// Get author name

function authorName(text) {
	text = text.toString()
	return text.slice(0, text.indexOf('<') - 1)
}

// Get author email

function authorEmail(text) {
	text = text.toString()
	return text.slice(text.indexOf('<') + 1, text.length - 1)
}

// Check if number

function isNumber(text) {
	if (text.length == 0 || !isNaN(text)) { return true }
	else { return 'Please enter a valid number.'}
}

// Convert to number

function getNumber(text) {
	return Number(text)
}

// Check if not empty

function notEmpty(text) {
	if (text.length > 0) { return true }
	else { return 'Please enter a valid string.'}
}

// DRIVER //

try {
	getAction()
}
catch(error) {
	print('Fatal error, will exit.', 'danger')
	console.log(error)
}

