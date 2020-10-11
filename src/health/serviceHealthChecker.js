const readConfigs = require('../configs/readConfigs')
const fs = require('fs')
const fetch = require('node-fetch')
const ReadConfigs = new readConfigs()
const serviceEndpoints = ReadConfigs.getAllServicesPingEndpoints()

serviceEndpoints.forEach((endpoint) => {
    setInterval(async() => {
        try{
            const response = await fetch(`http://${endpoint.backendHostname}:${endpoint.port}${endpoint.pingEndpoint}`)
            if(response.status === 200 ) {
                console.log(`${endpoint.serviceName}: ONLINE`)
            } else {
                console.log(`${endpoint.serviceName}: UNKNOWN`)
            }
        }
        catch {
            console.log(`${endpoint.serviceName}: OFFLINE`)
        }
        

    },endpoint.pingFrequency)
})
