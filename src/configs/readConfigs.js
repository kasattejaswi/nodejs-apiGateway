const fs = require('fs')

class ReadConfigs {
    constructor() {
        const serviceFile = JSON.parse(fs.readFileSync(__dirname+"/../../configuration/services/service.json"))
        const serviceData = []
        for(let i of serviceFile) {
            const routeRuleName = i.routeRule
            const routesData = JSON.parse(fs.readFileSync(__dirname+'/../../configuration/routes/'+routeRuleName+'.json'))
            i['routes'] = routesData
            serviceData.push(i)
        }
        this.configs = serviceData
    }

    getDestinationService(contextRoot, path, method) {
        let isValid = false
        let hostname
        let port
        let requiresAuth
        this.configs.forEach((config) => {
            if(config.contextRoot === contextRoot) {
                hostname = config.backendHostname
                port = config.port
                config.routes.forEach((route) => {
                    if(route.routeName.includes(':')) {
                        const splitPath = path.split('/')
                        const splitRouteName = route.routeName.split('/')
                        let overallMatch = true
                        if(splitPath.length !== splitRouteName.length) {
                            overallMatch = false
                        }
                        else {
                            splitRouteName.forEach((path, index) => {
                                if(!(path.includes(':')) && !(path === splitPath[index])) {   
                                    overallMatch = false
                                }
                            })
                        }
                        if(overallMatch && route.method === method && route.type === 'public') {
                            requiresAuth = route.needsAuth
                            isValid = true
                        }
                    }
                    else {
                        if(route.routeName === path && route.method === method && route.type === 'public') {
                            requiresAuth = route.needsAuth
                            isValid = true
                        }
                    }
                })
            }
        })
        return {
            isValid,
            hostname,
            port,
            requiresAuth
        }
    }

    getAllServicesPingEndpoints() {
        let endpoints = []
        this.configs.forEach((config) => {
            const serviceName = config.serviceName
            const backendHostname = config.backendHostname
            const port = config.port
            const pingEndpoint = config.servicePingEndpoint
            const pingFrequency = config.pingFrequency
            endpoints.push({
                serviceName,
                backendHostname,
                port,
                pingEndpoint,
                pingFrequency
            })
        })
        return endpoints
    }
}

module.exports = ReadConfigs