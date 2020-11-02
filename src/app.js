const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('dotenv').config({
    path: process.env.CENTRAL_ENV
})
require('./health/serviceHealthChecker')
require('./database/connection')
const gatewayRouter = require('./router/gateway')
const router = require('./router/router')
const gatewayRouting = require('./router/routes')
const app = express()
if(process.env.MAINTENANCE_MODE === 'true') {
    app.use((req, res) => {
        res.status(503).send({
            error: "App is currently in maintence mode"
        })
    })
}
app.use(express.json())
app.use(cors())
app.use(gatewayRouter)
app.use(gatewayRouting)
app.use(router)

module.exports = app