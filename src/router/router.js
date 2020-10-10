const express = require("express")
const router = express.Router()
const fetch = require('node-fetch')
const validRequest = require('../middleware/validRequest')
const auth = require('../middleware/auth')

router.all("/*", [validRequest, auth], async (req, res) => {
    console.log(req.destinationPath)
    console.log(req.destinationHeaders)
    console.log(req.destinationBody)
    console.log(req.destinationMethod)
    const url = `http://${req.destinationService.hostname}:${req.destinationService.port}${req.destinationPath}`
    let forwardingOptions = {
        method: req.destinationMethod.toLowerCase(),
        headers: req.destinationHeaders
    }
    if(Object.keys(req.destinationBody).length > 0) {
        console.log('condition true')
        forwardingOptions['body'] = JSON.stringify(req.destinationBody)
    }
    console.log(req.destinationBody)
    console.log(forwardingOptions)
    const response = await fetch(url, forwardingOptions)
    // console.log(response.type())
    const json = await response.json()
    res.status(response.status).send(json)
})
module.exports = router