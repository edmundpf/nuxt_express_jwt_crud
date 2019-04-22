var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const autoIncrement = require('mongoose-sequence')(mongoose);
const SALT_WORK_FACTOR = 10;

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

async function preQueryHook(query) {
	try {
		var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		query.key = await bcrypt.hash(query.key, salt);
	}
	catch (error) {
		return next(error);
	}
	return query
}

secretKey.pre('save', async function(next) {
	if (!this.isModified('key') && !this.isNew) return next();
	try {
		var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		this.key = await bcrypt.hash(this.key, salt);
	}
	catch (error) {
		return next(error);
	}
});

secretKey.pre('updateOne', async function() {
	await preQueryHook(this.getUpdate());
});

secretKey.plugin(autoIncrement, { id: 'secret_key_uid', 
									inc_field: 'uid' });
module.exports = mongoose.model('SecretKey', secretKey);