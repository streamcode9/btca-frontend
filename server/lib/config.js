require('dotenv').config()

exports.auth0 = {
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET
}
