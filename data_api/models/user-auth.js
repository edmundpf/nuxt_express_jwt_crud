var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const autoIncrement = require('mongoose-sequence')(mongoose);
const SALT_WORK_FACTOR = 10;

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

async function preQueryHook(query) {
	try {
		var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		query.password = await bcrypt.hash(query.password, salt);
	}
	catch (error) {
		return next(error);
	}
	return query
}

userAuth.pre('save', async function(next) {
	if (!this.isModified('password') && !this.isNew) return next();
	try {
		var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		this.password = await bcrypt.hash(this.password, salt);
	}
	catch (error) {
		return next(error);
	}
});

userAuth.pre('updateOne', async function() {
	await preQueryHook(this.getUpdate());
});

userAuth.plugin(autoIncrement, { id: 'user_auth_uid', 
									inc_field: 'uid' });
module.exports = mongoose.model('UserAuth', userAuth);