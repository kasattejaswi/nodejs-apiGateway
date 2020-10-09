const fs = require('fs')
const fetch = require('node-fetch')
const authDefinition = JSON.parse(fs.readFileSync(`${__dirname}/../../definitions/auth.json`))

const auth =  (req, res, next) => {
    const url = `http://${authDefinition.hostname}:${authDefinition.port}${authDefinition.endpoint}`
    const headers = {}
    if(!req.destinationService.requiresAuth) {
        return next()
    }
    for(let header of authDefinition.headers) {
        header = header.toLowerCase()
        headers[header] = req.headers[header]
    }
    let status
    fetch(url,{
        method: authDefinition.method.toLowerCase(),
        headers
    }).then( (resp) => {
        if(resp.status === 200) {
            next()
        }
        else {
            status = resp.status
            return resp.json()
        }
    }).then(json => {
        res.status(status).send(json)
    })
}

module.exports = auth