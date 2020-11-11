const express = require("express");
const gatewayAuth = require("../middleware/gatewayAuth");
const router = express.Router();
const Routes = require("../models/routes");

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
    try {
    } catch (e) {
        res.status(500).send({
            success: false,
            error: "Something went wrong !!",
        });
    }
});

router.patch("/gateway/route", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("UPDATE_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }
    try {
    } catch (e) {
        res.status(500).send({
            success: false,
            error: "Something went wrong !!",
        });
    }
});

router.delete("/gateway/route", gatewayAuth, async (req, res) => {
    if (!req.user.permissions.includes("DELETE_ROUTES")) {
        return res.status(403).send({
            success: false,
            error: "Operation not permitted",
        });
    }
    try {
    } catch (e) {
        res.status(500).send({
            success: false,
            error: "Something went wrong !!",
        });
    }
});

module.exports = router;
