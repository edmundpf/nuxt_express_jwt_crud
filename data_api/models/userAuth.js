var mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const hooks = require('../utils/model-hooks');

var userAuth = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		unique: true,
		required: true,
	},
},
	{
		collection: 'user_auth',
		timestamps: true,
	},
);

userAuth.pre('save', async function() {
	await hooks.saveEncrypt(this, 'password');
});

userAuth.pre('updateOne', async function() {
	await hooks.updateEncrypt(this.getUpdate(), 'password');
});

userAuth.plugin(autoIncrement, { id: 'user_auth_uid', 
									inc_field: 'uid' });
module.exports = mongoose.model('UserAuth', userAuth);