const mongoose = require("mongoose");
const validator = require("validator");

const routeSchema = new mongoose.Schema({
    routePath: {
        type: "String",
        required: true,
    },
    serviceId: {
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
});

const Routes = mongoose.model("Routes", routeSchema);
module.exports = Routes;
