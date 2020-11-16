const express = require("express");
const gatewayAuth = require("../middleware/gatewayAuth");
const router = express.Router();
const Routes = require("../models/routes");
const { route } = require("./services");

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
        const service = await Routes.findOne({ _id: serviceId });
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "No service found",
            });
        }
        const route = {
            routePath: req.body.routePath,
            method: req.body.method,
            needsAuth: req.body.needsAuth,
            privacy: req.body.privacy,
        };
        const isRouteExists = service.routes.some(
            (route) =>
                route.routePath == req.body.routePath &&
                route.method == req.body.method
        );
        if (isRouteExists) {
            return res.status(400).send({
                success: false,
                error:
                    "Route path already exists. Please enter a different one",
            });
        }
        service.routes = service.routes.concat(route);
        await service.save();
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

router.patch(
    "/gateway/route/:serviceId/:routeId",
    gatewayAuth,
    async (req, res) => {
        if (!req.user.permissions.includes("UPDATE_ROUTES")) {
            return res.status(403).send({
                success: false,
                error: "Operation not permitted",
            });
        }
        // try {
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
        const serviceId = req.params.serviceId;
        const routeId = req.params.routeId;
        const service = await Routes.findOne({
            _id: serviceId,
            "routes._id": routeId,
        });
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "Route not found",
            });
        }
        if (req.body.serviceId) {
            // If service Id is present in the update:
            // 1. Find the service from that route
            const newService = await Routes.findOne({
                _id: req.body.serviceId,
            });
            // 2. Filter the existing service and delete the route from it
            let routeToDelete;
            for (let i of service.routes) {
                if (i._id == routeId) {
                    routeToDelete = i;
                    break;
                }
            }
            console.log(routeToDelete);
            service.routes = service.routes.filter(
                (route) => route._id != routeId
            );
            // 3. Concat the route to the new service
            const isRouteExists = newService.routes.some(
                (route) =>
                    route.routePath == routeToDelete.routePath &&
                    route.method == routeToDelete.method
            );
            if (isRouteExists) {
                return res.status(400).send({
                    success: false,
                    error:
                        "Route path already exists. Please enter a different one",
                });
            }
            //  Perform updates for the rest of the route
            Object.keys(req.body).forEach((key) => {
                if (key !== "serviceId") {
                    console.log("service id no found");
                    routeToDelete[key] = req.body[key];
                }
            });

            newService.routes = newService.routes.concat(routeToDelete);
            console.log(newService);
            await service.save();
            await newService.save();
            // 4. Perform rest of the updates
            res.send({
                success: true,
                message: "Route updated successfully",
            });
        } else {
            for (let i of service.routes) {
                if (i._id == routeId) {
                    Object.keys(req.body).forEach((key) => {
                        if (key !== "serviceId") {
                            console.log("service id no found");
                            routeToDelete[key] = req.body[key];
                        }
                    });
                    break;
                }
            }
        }

        // To update the rest -
        // 1. Check if serviceId is changed
        // 2. If yes - do modifications in service
        // 3. If no - do modifications in newService
        // } catch (e) {
        //     res.status(500).send({
        //         success: false,
        //         error: "Some error occurred!!",
        //     });
        // }
    }
);

router.delete("/gateway/route", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("DELETE_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }
    const isValidRequest = checkValidRequest(Object.keys(req.body), [
        "serviceId",
        "routeId",
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
        const service = await Routes.findOne({ _id: serviceId });
        if (!service) {
            return res.status(404).send({
                success: false,
                error: "No service found",
            });
        }
        const isRouteExists = service.routes.some(
            (route) => route._id == req.body.routeId
        );
        if (!isRouteExists) {
            return res.status(400).send({
                success: false,
                error:
                    "Route not found. Maybe it never existed or already deleted.",
            });
        }
        service.routes = service.routes.filter(
            (route) => route._id != req.body.routeId
        );
        await service.save();
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
