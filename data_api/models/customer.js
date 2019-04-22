var mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

var customer = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	products_purchased: [{
		type: String,
	}],
},
	{
		collection: 'customers',
		timestamps: true,
		usePushEach: true,
	},
);

customer.plugin(autoIncrement, { id: 'customer_uid', 
									inc_field: 'uid' });
module.exports = mongoose.model('Customer', customer);