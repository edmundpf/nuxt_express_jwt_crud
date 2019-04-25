var inquirer = require('inquirer')
const models = require('./data_api/models')

const packageConfig = require('./package.json')
const webConfig = require('./assets/json/webConfig.json')
const schemaConfig = require('./data_api/config/schema-config.json')
const serverConfig = require('./data_api/config/server-config.json')

// METHODS //

// Get Action

function getAction() {
	const choices = {
						configApp: 'Configure API/Web App',
						configSchema: 'Configure Database Schema',
						setSecret: 'Set up a secret key',
						createAdmin: 'Create an admin account',
						resetAdmin: 'Reset admin accounts',
					}
	inquirer.prompt([
		{ 
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: Object.values(choices)
		}
	])
	.then(answer => {
		for (const choice of Object.keys(choices)) {
			if (choices[choice] == answer.action) {
				eval(`${choice}()`)
			}
		}
	})
}

// Configure API/Web App

function configApp() {
	console.log('> Hit enter to use current values.')
	inquirer.prompt([
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
			name: 'package_desc',
			message: 'Enter package description:',
			default: packageConfig.description
		},
		{ 
			type: 'input',
			name: 'author_name',
			message: 'Enter author name:',
			default: authorName(packageConfig.author),
		},
		{ 
			type: 'input',
			name: 'author_email',
			message: 'Enter author email:',
			default: authorEmail(packageConfig.author),
		},
		{ 
			type: 'list',
			name: 'private_repo',
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
			name: 'api_port',
			message: 'Enter backend API port:',
			validate: isNumber,
			default: serverConfig.serverPort,
		},
		{ 
			type: 'input',
			name: 'web_port',
			message: 'Enter web app port:',
			validate: isNumber,
			default: serverConfig.corsPort,
		},
		{ 
			type: 'input',
			name: 'mongo_port',
			message: 'Enter MongoDB port:',
			validate: isNumber,
			default: serverConfig.mongoosePort,
		},
		{ 
			type: 'input',
			name: 'mongo_name',
			message: 'Enter MongoDB database name:',
			default: serverConfig.databaseName,
		},
		{ 
			type: 'input',
			name: 'web_name',
			message: 'Enter website name to display in title bar:',
			default: webConfig.site_title,
		},
		{ 
			type: 'input',
			name: 'web_desc',
			message: 'Enter website description:',
			default: webConfig.site_desc,
		},
	])
	.then(answer => {
		console.log(answer)
		exitPrompt()
	})
}

// Configure Schema

function configSchema() {
	var prompts = []
	const schemas = Object.keys(models)
	for (const schema of schemas) {
		if (!['userAuth', 'secretKey'].includes(schema)) {
			prompts.push(
			{
				type: 'input',
				name: `${schema}_path`,
				message: `Enter "${schema}" web path:`,
			},
			{
				type: 'input',
				name: `${schema}_key`,
				message: `Enter "${schema}" primary key:`,
			})
		}
	}
	inquirer.prompt(prompts)
	.then(answer => {
		console.log(answer)
		exitPrompt()
	})
}

// Set Secret Key

function setSecret() {
	inquirer.prompt([
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
	.then(answer => {
		console.log(answer)
		exitPrompt()
	})
}

// Create Admin Account

function createAdmin() {
	inquirer.prompt([
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
	.then(answer => {
		console.log(answer)
		exitPrompt()
	})
}

// Reset Admin Accounts

function resetAdmin() {
	console.log('> This will delete all your admin account credentials.')
	inquirer.prompt([
		{ 
			type: 'list',
			name: 'delete',
			message: 'Do you want to clear all admin credentials?',
			choices: ['Yes', 'No']
		},
	])
	.then(answer => {
		console.log(answer)
		if (answer.delete == 'No') {
			exitPrompt()
		}
		else {
			surePrompt()
		}
	})

}

// Are you sure prompt

function surePrompt(action) {
	inquirer.prompt([
		{ 
			type: 'list',
			name: 'sure',
			message: 'Are you sure?',
			choices: ['Yes', 'No']
		},
	])
	.then(answer => {
		console.log(answer)
		exitPrompt()
		return
	})
}

// Exit Prompt

function exitPrompt() {
	inquirer.prompt([
		{ 
			type: 'list',
			name: 'exit',
			message: 'Would you like to do something else or exit?:',
			choices: ['Do something else', 'Exit'],
		},
	])
	.then(answer => {
		if (answer.exit == 'Exit') {
			console.log('Goodbye.')
		}
		else {
			getAction()
		}
	})
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

// Check if not empty

function notEmpty(text) {
	if (text.length > 0) { return true }
	else { return 'Please enter a valid string.'}
}

// DRIVER //

getAction()
