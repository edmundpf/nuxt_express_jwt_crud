var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Pre-Save hook to save CSV lists for array fields

async function listCreate(doc, fields) {
	try {
		for (const field of fields) {
			const vals = doc[field].split(',');
			console.log(vals)
			doc[field] = []
			for (const val of vals) {
				doc[field].push(val)
			}
		}
	}
	catch (error) {
		return { message: 'Could not set array field value.', 
				errorMsg: error }
	}
	return doc;
}

// Pre-Save hook to encrypt field

async function saveEncrypt(doc, key) {
	if (!doc.isModified(key) && !doc.isNew) return;
	try {
		var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		doc[key] = await bcrypt.hash(doc[key], salt);
	}
	catch (error) {
		return { message: 'Could not create encrypted field.', 
				errorMsg: error }
	}
	return doc
}

// Pre-Update hook to encrypt field

async function updateEncrypt(query, key) {
	try {
		var salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		query[key] = await bcrypt.hash(query[key], salt);
	}
	catch (error) {
		return { message: 'Could not update encryptd field.', 
				errorMsg: error }
	}
	return query
}

// EXPORTS //

module.exports = {
	listCreate,
	saveEncrypt,
	updateEncrypt,
}