const express = require("express")
const router = express.Router()
const fetch = require('node-fetch')
const validRequest = require('../middleware/validRequest')
const auth = require('../middleware/auth')

router.all("/*", [validRequest, auth], (req, res) => {
    console.log(req.destinationPath)
    console.log(req.destinationHeaders)
    console.log(req.destinationBody)
    console.log(req.destinationMethod)
    const url = `http://${req.destinationService.hostname}:${req.destinationService.port}${req.destinationPath}`
    let responseStatus
    let responseHeaders
    fetch(url, {
        method: req.destinationMethod.toLowerCase(),
        headers: req.destinationHeaders,
        body: JSON.stringify(req.destinationBody)
    }).then((resp) => {
        responseStatus = resp.status
        responseHeaders = resp.headers
        // return resp
        return resp.json()
    }).then((json) => {
        res.status(responseStatus).send(json)
    })
});

module.exports = router;
