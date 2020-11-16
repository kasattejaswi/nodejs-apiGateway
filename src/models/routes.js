const mongoose = require("mongoose");
const validator = require("validator");

const routesSchema = new mongoose.Schema({
    serviceName: {
        type: "String",
        required: true,
        unique: true,
    },
    contextRoot: {
        type: "String",
        required: true,
        unique: true,
    },
    backendHostname: {
        type: "String",
        required: true,
    },
    port: {
        type: "String",
        required: true,
    },
    servicePingEndpoint: {
        type: "String",
        required: true,
    },
    pingFrequency: {
        type: "String",
        required: true,
    },
    routes: [
        {
            routePath: {
                type: "String",
                required: true,
            },
            method: {
                type: "String",
                required: true,
            },
            needsAuth: {
                type: "Boolean",
                required: true,
            },
            privacy: {
                type: "String",
                required: true,
                validate(privacy) {
                    if (!["public", "private"].includes(privacy)) {
                        throw new Error(
                            "Only public and private are allowed in privacy"
                        );
                    }
                },
            },
        },
    ],
});

const Routes = mongoose.model("Routes", routesSchema);
module.exports = Routes;
