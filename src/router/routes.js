const express = require("express");
const gatewayAuth = require("../middleware/gatewayAuth");
const router = express.Router();
const Routes = require("../models/routes");
const Services = require("../models/services");

const checkValidRequest = (receivedKeys, allowedKeys) => {
    return receivedKeys.every((key) => allowedKeys.includes(key));
};

router.get("/gateway/routes", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("READ_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }
    try {
        const routes = await Routes.find({});
        res.send({
            success: true,
            routes: routes,
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            error: "Something went wrong !!",
        });
    }
});

router.post("/gateway/route", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("CREATE_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }
    const isValidRequest = checkValidRequest(Object.keys(req.body), [
        "serviceId",
        "routePath",
        "needsAuth",
        "privacy",
        "method",
    ]);
    if (!isValidRequest) {
        return res.status(400).send({
            success: false,
            error:
                "BAD REQUEST!! Some passed parameters are either empty or invalid",
        });
    }
    try {
        const serviceId = req.body.serviceId;
        const service = await Services.findOne({ _id: serviceId });
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "No service found",
            });
        }
        const route = new Routes({
            routePath: req.body.routePath,
            method: req.body.method,
            needsAuth: req.body.needsAuth,
            privacy: req.body.privacy,
            serviceId: req.body.serviceId,
        });
        const isRouteExists = await Routes.findOne({
            routePath: req.body.routePath,
            method: req.body.method,
            serviceId: req.body.serviceId,
        });
        if (isRouteExists) {
            return res.status(400).send({
                success: false,
                error:
                    "Route path already exists. Please enter a different one",
            });
        }
        await route.save();
        res.status(201).send({
            success: true,
            message: "Route has been added to the service",
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            error:
                "BAD REQUEST!! Some passed parameters are either empty or invalid",
        });
    }
});

router.patch("/gateway/route/:routeId", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("UPDATE_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }
    try {
        const isValidRequest = checkValidRequest(Object.keys(req.body), [
            "serviceId",
            "routePath",
            "method",
            "needsAuth",
            "privacy",
        ]);
        if (!isValidRequest) {
            return res.status(400).send({
                success: false,
                error:
                    "BAD REQUEST!! Some passed parameters are either empty or invalid",
            });
        }
        const routeId = req.params.routeId;
        if (req.body.serviceId) {
            const service = await Services.findOne({
                _id: serviceId,
            });
            if (!service) {
                return res.status(404).send({
                    success: false,
                    error: "Service not found",
                });
            }
        }
        const route = await Routes.findOne({ _id: routeId });
        Object.keys(req.body).forEach((key) => (route[key] = req.body[key]));
        const isAlreadyPresent = await Routes.findOne({
            routePath: route.routePath,
            method: route.method,
            needsAuth: route.needsAuth,
            privacy: route.privacy,
            serviceId: route.serviceId,
        });
        if (isAlreadyPresent) {
            res.status(400).send({
                success: false,
                error: "Route with the same data already present",
            });
        }
        await route.save();
        res.send({
            success: true,
            message: "Route updated successfully",
        });
    } catch (e) {
        res.status(500).send({
            success: false,
            error: "Some error occurred!!",
        });
    }
});

router.delete("/gateway/route/:id", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("DELETE_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }

    try {
        const isRouteExists = await Routes.findOne({ _id: req.params.id });
        if (!isRouteExists) {
            return res.status(400).send({
                success: false,
                error:
                    "Route not found. Maybe it never existed or already deleted.",
            });
        }
        await Routes.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Route deleted successfully",
        });
    } catch (e) {
        res.status(400).send({
            success: false,
            error:
                "BAD REQUEST!! Some passed parameters are either empty or invalid",
        });
    }
});

module.exports = router;
