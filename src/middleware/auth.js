const fs = require('fs')
const fetch = require('node-fetch')
const authDefinition = JSON.parse(fs.readFileSync(`${__dirname}/../../definitions/auth.json`))

const auth =  async (req, res, next) => {
    const url = `http://${authDefinition.hostname}:${authDefinition.port}${authDefinition.endpoint}`
    const headers = {}
    if(!req.destinationService.requiresAuth) {
        return next()
    }
    for(let header of authDefinition.headers) {
        header = header.toLowerCase()
        headers[header] = req.headers[header]
    }
    try {
        const response = await fetch(url,{
            method: authDefinition.method.toLowerCase(),
            headers
        })
        if(response.status === 200) {
            next()
        }
        else {
            const json = await response.json()
            res.status(response.status).send(json)
        }
    }
    catch {
        res.status(504).send({
            error: 'Unable to complete the request'
        })
    }
    
    
}

module.exports = auth