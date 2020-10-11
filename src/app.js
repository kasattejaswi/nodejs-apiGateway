const express = require('express')
require('dotenv').config()
require('dotenv').config({
    path: process.env.CENTRAL_ENV
})
require('./health/serviceHealthChecker')
const router = require('./router/router')
const app = express()
app.use(express.json())
app.use(router)

module.exports = app