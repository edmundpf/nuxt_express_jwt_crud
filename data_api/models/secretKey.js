var mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const hooks = require('../utils/model-hooks');

var secretKey = new mongoose.Schema({
	key: {
		type: String,
		unique: true,
		required: true,
	},
},
	{
		collection: 'secret_key',
		timestamps: true,
	},
);

secretKey.pre('save', async function() {
	await hooks.saveEncrypt(this, 'key');
});

secretKey.pre('updateOne', async function() {
	await hooks.updateEncrypt(this.getUpdate(), 'key');
});

secretKey.plugin(autoIncrement, { id: 'secret_key_uid', 
									inc_field: 'uid' });
module.exports = mongoose.model('SecretKey', secretKey);