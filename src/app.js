const express = require('express')
require('dotenv').config()
require('dotenv').config({
    path: process.env.CENTRAL_ENV
})
const app = express()

app.all('/*', (req, res) => {
    console.log(req.url)
    console.log(req.method)
    console.log(req.path)
    console.log(req.query)
    console.log(req.body)
    res.send({success: 'Gateway is running normally'})
})

module.exports = app