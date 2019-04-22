# DATA SCHEMAS
## General
* All fields contain *createdAt, updatedAt, and uid* fields
## Account Listing
**COLLECTION:** *account_listings*
* url
  * string, unique, required
* site
  * string, required
* username
  * string, required
* submission_karma
  * number, default: 0
* comment_karma
  * number, default: 0
* view_count
  * number, default: 0
* reply_count
  * number, default: 0
* replies
  * [ string ]
* sold
  * boolean, default: false
* delivered
  * boolean, default: false
## Reddit Submission
**COLLECTION:** *reddit_submissions*
* url
  * string, unique, required
* type
  * string, required, enum: ['post', 'comment'], default: 'post'
* source_type
  * string, required
* media_url
  * string, default: ''
* source_url
  * string, default: ''
* source_media_url
  * string, default: ''
* source_extra
  * [ string ]
* karma
  * number, default: 0
* deleted
  * boolean, default: false
## Reddit User
**COLLECTION:** *reddit_users*
* username
  * string, unique, required
* email
  * string, unique, required
* password
  * string, required
* twitter_user
  * string, required
* client_id
  * string
* client_secret
  * string
* session_data
  * [ string ]
* email_verified
  * boolean, default: false
* creation_ip
  * string, default: ''
* current_ip
  * string, default: ''
* ips
  * [ string ]
* creation_user_agent
  * string, default: ''
* current_user_agent
  * string, default: ''
* user_agents
  * [ string ] 
* submission_count
  * number, default: 0
* comment_count
  * number, default: 0
* submission_karma
  * number, default: 0
* comment_karma
  * number, default: 0
* listing_uids
  * [ number ]
## Twitter User
**COLLECTION:** *twitter_users*
* username
  * string, unique, required
* consumer_key
  * string, unique, required
* consumer_secret
  * string, unique, required
* access_token
  * string, unique, required
* access_token_secret
  * string, unique, required
## User Auth
**COLLECTION:** *user_auth*
* username
  * string, unique, required
* password
  * string, unique, required
