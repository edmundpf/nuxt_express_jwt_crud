# DATA API
## Specs
* Uses JSON Web Tokens for verification
  * Tokens last 24 hours and are refreshed every hour upon api use
## General
* JSON response will contain `{"status": "ok"}` on success, and `{"status": "error"}` on error.
* JSON response will contain *response* field with extra data i.e. `{"status": "ok", "response": {"message": "success"}}`
* JSON response will containe *refresh_token* field with refresh token: `{"refresh_token": { username, uid, accesstoken, expires_in }}`
* Routes require JWT to authenticate
  * Token can be sent in request with parameter `?auth_token=xxx` or in *x-access-token* header
  * No token error: `{ status: 'error', response: { message: 'No token provided.'}}`
  * Invalid token error: `{ status: 'error', response: { message: 'Invalid token.'}}`
## Auth Routes
* `/signup`
  * Parameters: `username, password, sk`
    * *username* and *password* must have at least 8 characters and *password* must have at least 1 number.
    * *sk* is your secret signup key located in `~/data_api/utils/server-config.js`
  * Success: `{ username, uid, accesstoken, expires_in }`
  * Error: `{ message: "", codes: ["ERROR_CODE"] }`
* `/login`
  * Parameters: `username, password`
  * Success: `{ username, uid, accesstoken, expires_in }`
  * Error: `{ message: "", codes: ["ERROR_CODE"] }`
* `/update_password`
  * **JWT Required**
  * Parameters: `username, current_password, password`
      * *password* must have at least 8 characters and must have at least 1 number.
  * Success: `{ status: 'ok', response: { message: 'Password updated.'} }`
  * Error: `{ message: "", codes: ["ERROR_CODE"] }`
* `/b64`
  * Parameters: `string`
  * Success: `{"status":"ok","response":"NjlTYXNzeVBvcHRhcnRz"}`
  * Error: `{"status":"error","response":"Could not encode string."}`
  ## CRUD Routes
  * Routes are applied to *account_listing, reddit_submission, reddit_user, twitter_user, and user_auth* models
    * I.E. */reddit_user/insert?...*
  * `x/insert`
    * Inserts record
    * Success: `{attributes...}`
    * Error: `{ name: "MongoError", code: 1050 }`
  * `x/update, x/push, x/set`
    * `x/update` updates record
    * `x/push` pushes comma separated records into list
    * `x/set` sets list to comma separated records
    * Primary key required
    * Success: `{ n, nModified, ok }`
    * *push* and *set* **CANNOT** be used on *twitter_user* and *user_auth* routes
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
  * `x/sterilize`
    * Removes obsolete fields after updating schema
    * Parameters: *fields* includes obsolete keys i.e. `?fields=old_data1,old_data2`
