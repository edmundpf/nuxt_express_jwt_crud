# DATA API
## Specs
* Uses JSON Web Tokens for verification
  * Tokens last 24 hours and are refreshed every hour upon api use
## General
* JSON response will contain `{"status": "ok"}` on success, and `{"status": "error"}` on error.
* JSON response will contain *response* field with extra data i.e. `{"status": "ok", "response": {"message": "success"}}`
* JSON response will contain *refresh_token* field with refresh token: `{"refresh_token": { username, uid, accesstoken, expires_in }}`
* Routes require JWT to authenticate
  * Token can be sent in request with parameter `?auth_token=xxx` or in *x-access-token* header
  * No token error: `{ status: 'error', response: { message: 'No token provided.'}}`
  * Invalid token error: `{ status: 'error', response: { message: 'Invalid token.'}}`
## Auth Routes
* `/login`
  * Parameters: `username, password`
  * Success: `{ username, uid, accesstoken, expires_in }`
  * Error: `{ message: "", codes: ["ERROR_CODE"] }`
* `/signup`
  * Parameters: `username, password, secret_key`
    * *username* and *password* must have at least 8 characters and *password* must have at least 1 number.
    * *secret_key* is the secret key you set up with the CLI
	* **This endpoint is self-protecting, after ONE user is added JWT will be required**
  * Success: `{ username, uid, accesstoken, expires_in }`
  * Error: `{ message: "", codes: ["ERROR_CODE"] }`
* `/update_password`
  * **JWT Required**
  * Parameters: `username, current_password, password`
      * *password* must have at least 8 characters and must have at least 1 number.
	* **This endpoint is self-protecting, after ONE secret key is added JWT will be required**
  * Success: `{ status: 'ok', response: { message: 'Password updated.'} }`
  * Error: `{ message: "", codes: ["ERROR_CODE"] }`
* `/verify_token`
	* **JWT Required**
	* Parameters: `auth_token`
	* Success: `{ status: 'ok', response: { message: 'Token verified.'}`
  ## CRUD Routes
  * Routes are applied to collection name i.e. "x"
    * I.E. */reddit_user/insert?...*
  * `x/insert`
    * Inserts record
    * Success: `{attributes...}`
    * Error: `{ name: "MongoError", code: 1050 }`
  * `x/update, x/push, x/push_unique, x/set`
    * `x/update` updates record
    * `x/push` pushes comma separated records into list
			* Records will be placed regardless if there is an existing matching record in the list
		* `x/push_unique` pushes unique comma separated records into the list
			* Only records that do not exist already will be placed in the list
			* This **WILL NOT** delete existing duplicate records
    * `x/set` sets list to comma separated records
    * Primary key required
    * Success: `{ n, nModified, ok }`
  * `x/delete, x/delete_all`
    * Deletes single record or all records, primary key required for *delete*
    * Success: `{ n, deletedCount, ok }`
  * `x/get`
    * Gets single record
    * Parameters: requires model primary key, i.e. `/reddit_user/get?username=BOB`
    * Success: `[{attributes...}]`
  * `x/get_all`
    * Gets all records
    * Success: `[{attributes...}, {}...]`
	* `x/schema`
		* Gets schema information
		* Success: `{ schema: [], primary_key, list_fields: [] }`
  * `x/sterilize`
    * Removes obsolete fields after updating schema
    * Parameters: *fields* includes obsolete keys i.e. `?fields=old_data1,old_data2`
