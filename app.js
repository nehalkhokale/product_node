// BASE SETUP
// =============================================================================
const express = require('express')
var app = express()
var cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
//  const helmet = require('helmet')
const uuid = require('uuid')
const MongoStore = require('connect-mongo')(session)
// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./swagger.json')
const cookieParser = require('cookie-parser')
const ErrorHandler = require('./utility/ErrorHandler').handleError
// run cron job
// Scheduler.contractLocking()
//  DATABASE CONNECTION
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/


const dbIgnored = require(`${__dirname}/./database/connect`)
//  CONFIG
const config = require(`${__dirname}/./config/config`)
const mongoose = require('mongoose')
const mongoDB = process.env.MONGO_URL || config.db.mongodb_url
mongoose.connect(mongoDB, {useNewUrlParser: true})
//  ROUTES
// let corsOptions = {
//     origin: function(origin, callback) {
//         // console.log('Origin: ', origin);
//         if (whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             // console.log('Origin in else: ', origin);
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true,
//     preflightContinue: false,
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Total-Count', 'x-access-token', 'Content-Range', 'Access-Control-Allow-Methods'],
//     methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
// }
const router = require(`${__dirname}/./routes/router`)
// app.use(config.app.prefix, cors(corsOptions), router)
app.use(cors())

//  DEFINE OUR APP USING EXPRESS

// let whitelist = ['http://localhost:3000']

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '2mb',
}))
app.use(bodyParser.json({limit: '2mb'}))
app.use(cookieParser())

// const store = new MongoStore({
        
//     url: 'mongodb://localhost:27017/balancesheet'
// })
const store = new MongoStore({
    url: process.env.MONGO_URL ? process.env.MONGO_URL : config.db.mongodb_session_store_url + config.db.session_db_name + config.db.session_db_options,
    ttl: config.cookie.validity,
    autoRemove: 'native', // Default
})  
const sess = {
    key: config.cookie.name,
    secret: config.app.secret,
    cookie: {
        domain: config.cookie.domain,
        path: config.cookie.path,
        maxAge: config.cookie.validity * 1000,
        httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
    store: store,
    name: config.cookie.name,
    genid: function() {
        return uuid() // use UUIDs for session IDs
    },
}
// console.log('sees',sess);

app.use(session(sess))

//  session management
session.Session.prototype.login = (req, user, cb) => {
    // console.log('---user',user);
    try {
        req.session.userInfo = user
        req.session.user = user.email
        // console.log(' in session login', req.session.user);
        
        cb()
    } catch (error) {
        cb(error)
    }
}
//  HELMET
//  Helmet helps you secure your Express apps by setting various HTTP headers
//  let helmetOpts = {
//    frameguard: false,
//  }
//  app.use(helmet(helmetOpts))

// Use Mongo Store for Session data storage

    app.use(config.app.prefix, router)
// }


//  app.use(config.app.prefix, router)
app.use(ErrorHandler)
//  START THE SERVER
app.listen((process.env.PORT || config.server.port))
module.exports = app // for testing
