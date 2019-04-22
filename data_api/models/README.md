# DATA SCHEMAS
## General
* All fields contain *createdAt, updatedAt, and uid* fields
* Example customer schema included
* Add your own schemas for your purposes, *DO NOT DELETE* `user_auth` or `secret_key` schemas
## Customer
**COLLECTION:** *twitter_users*
* email
  * string, unique, required
* first_name
  * string, unique, required
* last_name
  * string, unique, required
* products_purchased
  * [string]
## User Auth
**COLLECTION:** *user_auth*
* username
  * string, unique, required
* password
  * string, unique, required
## Secret Key
**COLLECTION:** *secret_key*
* key
  * string, unique, required
