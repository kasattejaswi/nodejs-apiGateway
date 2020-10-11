const fetch = require('node-fetch')
const readConfigs = require('../configs/readConfigs')
const healthUpdates = require('../configs/healthUpdates')
const ReadConfigs = new readConfigs()
const HealthUpdate = new healthUpdates()
const serviceEndpoints = ReadConfigs.getAllServicesPingEndpoints()

serviceEndpoints.forEach((endpoint) => {
    setInterval(async() => {
        try{
            const response = await fetch(`http://${endpoint.backendHostname}:${endpoint.port}${endpoint.pingEndpoint}`)
            if(response.status === 200 ) {
                const date = new Date()
                HealthUpdate.updateStatus(endpoint.serviceName, 'ONLINE', new Date().toUTCString())
            } else {
                HealthUpdate.updateStatus(endpoint.serviceName, 'UNKNOWN', new Date().toUTCString())
            }
        }
        catch {
            HealthUpdate.updateStatus(endpoint.serviceName, 'OFFLINE', new Date().toUTCString())
        }
        

    },endpoint.pingFrequency)
})
