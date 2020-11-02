const express = require('express')
const gatewayAuth = require('../middleware/gatewayAuth')
const router = express.Router()
const Routes = require('../models/routes')

//  List of all routes
// Get routes of all services
// Create a new service
// Create routes of a service
// Update a service
// Update routes of a service
// Delete a service
// Delete routes of a service
// Get service ping status if it is up or not
// Export json of a particular route
const checkValidRequest = (receivedKeys, allowedKeys) => {
    return receivedKeys.every(key => allowedKeys.includes(key))
}



router.post('/gateway/routes/service', gatewayAuth, async(req, res) => {
    if(!req.user.permissions.includes('CREATE_SERVICES')) {
        return res.status(403).send({
            success: false,
            error: 'Operation not permitted'
        })
    }

    const isValidRequest = checkValidRequest(Object.keys(req.body), ['serviceName','contextRoot','backendHostname','port','servicePingEndpoint','pingFrequency'])
    if(!isValidRequest) {
        return res.status(400).send({
            success: false,
            error: 'BAD REQUEST!! Some passed parameters are either empty or invalid'
        })
    }
    const routes = new Routes({
        serviceName: req.body.serviceName,
        contextRoot: req.body.contextRoot,
        backendHostname: req.body.backendHostname,
        port: req.body.port,
        servicePingEndpoint: req.body.servicePingEndpoint,
        pingFrequency: req.body.pingFrequency,
        routes: []
    })
    try {
        await routes.save()
        res.status(201).send({
            success: true,
            message: 'New service has been created'
        })
    } catch(e) {
        res.status(400).send({
            success: false,
            error: e.message
        })
    }
    
})

router.get('/gateway/routes/all', gatewayAuth, async(req, res) => {
    if(!req.user.permissions.includes('READ_SERVICES')) {
        res.status(403).send({
            success: false,
            message: 'Operation not permitted'
        })
    }
    try {
        const servicesWithRoutes = await Routes.find({})
        res.send({
            success: true,
            services: servicesWithRoutes
        })
    } catch(e) {
        res.status(500).send({
            success: false,
            message: e.message
        })
    }
})


module.exports = router