require('dotenv').config()

exports.auth0 = {
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET
}

exports.enablePayflowDebugAddress = true

exports.enabledPlans = {
	p1: { createAccountButtonText: 'Starter' },
	p2: { createAccountButtonText: 'Premium' },
	p3: { createAccountButtonText: 'VIP' }
}

exports.blockchain2xPub = process.env.BLOCKCHAIN2XPUB

exports.blockchain2APIKey = process.env.BLOCKCHAIN2APIKEY

exports.httpHostname = process.env.HTTPHOSTNAME