const express = require("express");
const gatewayAuth = require("../middleware/gatewayAuth");
const router = express.Router();
const Routes = require("../models/routes");

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
    return receivedKeys.every((key) => allowedKeys.includes(key));
};

router.post("/gateway/service", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("CREATE_SERVICES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }

    const isValidRequest = checkValidRequest(Object.keys(req.body), [
        "serviceName",
        "contextRoot",
        "backendHostname",
        "port",
        "servicePingEndpoint",
        "pingFrequency",
    ]);
    if (!isValidRequest) {
        return res.status(400).send({
            success: false,
            error:
                "BAD REQUEST!! Some passed parameters are either empty or invalid",
        });
    }
    const routes = new Routes({
        serviceName: req.body.serviceName,
        contextRoot: req.body.contextRoot,
        backendHostname: req.body.backendHostname,
        port: req.body.port,
        servicePingEndpoint: req.body.servicePingEndpoint,
        pingFrequency: req.body.pingFrequency,
        routes: [],
    });
    try {
        await routes.save();
        res.status(201).send({
            success: true,
            message: "New service has been created",
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            error: e.message,
        });
    }
});

router.get("/gateway/services", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("READ_SERVICES")) {
        return res.status(403).send({
            success: false,
            message: "Operation not permitted",
        });
    }
    try {
        const servicesWithRoutes = await Routes.find({});
        res.send({
            success: true,
            services: servicesWithRoutes,
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            message: e.message,
        });
    }
});

router.get("/gateway/service/:id", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("READ_SERVICES")) {
        return res.status(403).send({
            success: false,
            message: "Operation not permitted",
        });
    }
    try {
        const serviceId = req.params.id;
        const service = await Routes.findById(serviceId);
        console.log(service);
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "Service not found !!",
            });
        }
        res.send({
            success: true,
            service,
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            error: "Invalid request!!",
        });
    }
});

router.patch("/gateway/service/:id", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("UPDATE_SERVICES")) {
        return res.status(403).send({
            success: false,
            message: "Operation not permitted",
        });
    }
    const isValidRequest = checkValidRequest(Object.keys(req.body), [
        "serviceName",
        "contextRoot",
        "backendHostname",
        "port",
        "servicePingEndpoint",
        "pingFrequency",
    ]);
    if (!isValidRequest) {
        return res.status(400).send({
            success: false,
            error:
                "BAD REQUEST!! Some passed parameters are either empty or invalid",
        });
    }
    try {
        const serviceId = req.params.id;
        const service = await Routes.findOne({ _id: serviceId });
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "No service found for the provided id",
            });
        }
        Object.keys(req.body).forEach((key) => (service[key] = req.body[key]));
        await service.save();
        res.send({
            success: true,
            message: "Service updated successfully",
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            error: "Invalid request!!",
        });
    }
});

router.delete("/gateway/service/:id", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("DELETE_SERVICES")) {
        return res.status(403).send({
            success: false,
            message: "Operation not permitted",
        });
    }
    try {
        const serviceId = req.params.id;
        const service = await Routes.findOne({ _id: serviceId });
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "Service not found",
            });
        }
        await service.remove();
        res.send({
            success: true,
            message: "Service deleted successfully!",
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            error: "Invalid request!!",
        });
    }
});

module.exports = router;
