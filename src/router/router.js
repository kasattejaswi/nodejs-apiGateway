const express = require("express")
const router = express.Router()
const httpProxy = require('http-proxy')
const apiProxy = httpProxy.createProxyServer()
const validRequest = require('../middleware/validRequest')
const auth = require('../middleware/auth')

router.all("/*",[validRequest, auth],  async (req, res) => {
    const url = `http://${req.destinationService.hostname}:${req.destinationService.port}${req.destinationPath}`

        apiProxy.web(req, res, {target: url, ignorePath: true})
        apiProxy.on('error', function(e){
            res.status(504).send({
                error: 'Unable to complete the request'
            })
        })
    
})
module.exports = router