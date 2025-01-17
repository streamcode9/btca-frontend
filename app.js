console.error("appJs")
var	ss = require('socketstream')
,	fs = require('fs')
,	express = require('express')
,	auth = require('./server/lib/auth')
var bodyParser = require('body-parser')
var morgan = require('morgan')

function openForAppend(fileName)
{
	return fs.createWriteStream(fileName, {'flags': 'a'})
}

ss.client.define('main', {
	view:   'app.jade',
	css:    ['libs', 'app.styl'],
	code:   ['libs', 'main', 'system'],
	tmpl:   ['main']
})

ss.client.set({liveReload: false})

// Remove to use only plain .js, .html and .css files if you prefer
ss.client.formatters.add(require('ss-coffee'))
ss.client.formatters.add(require('ss-jade'))
ss.client.formatters.add(require('ss-stylus'))
/*
ss.session.store.use('redis');
ss.publish.transport.use('redis');
*/
ss.ws.transport.use('engineio', { io: function(io) {
   var m = 3
   io.set('close timeout', 25 * m)
   io.set('heartbeat timeout', 15 * m)
   io.set('heartbeat interval', 20 * m)
}})

// Minimise and pack assets if you type SS_ENV=production node app
if (ss.env == 'production') ss.client.packAssets();

let socketIoRequestHandler = null

function routes(app)
{
	app.use(auth.router)

/*
	app.get('/billing/blockchain/notify', billingBlockchain.notify(user.onPayment))
	app.get('/billing/blockchain2/notify', billingBlockchain2.notify(user.onPayment))
*/
	app.get('/', function (req, res)
	{
		res.serveClient('main')
	})
	app.get('/logout-auth0', (req, res) => {
		req.logout()
		res.redirect('/')
	})
	app.all('/engine.io/*', (req, res, next) => socketIoRequestHandler(req, res, next))
}

ss.http.middleware.prepend(morgan('combined', { stream: openForAppend("var/log/http.log")}))
ss.http.middleware.append(bodyParser())

const router = express.Router()
routes(router)
ss.http.middleware.append(router)

const app = express()

const server = app.listen(3000) //, '127.0.0.1');
const expressListener = server.listeners('request')
ss.start(server)

// reset listeners
const ioRequestListener = server.listeners('request')

socketIoRequestHandler = function (req, res) {
	ioRequestListener.forEach(function (listener) {
		listener.call(server, req, res)
	})
}

server.removeAllListeners('request')
expressListener.forEach(function (l) {
	server.on('request', l)
})

app.use(ss.http.middleware)
