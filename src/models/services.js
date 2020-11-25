const mongoose = require("mongoose");
const validator = require("validator");
const HealthCheck = require("../health/HealthCheck");

const healthChecks = new HealthCheck();
healthChecks.startHealthCheck();
const servicesSchema = new mongoose.Schema({
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
    protocol: {
        type: "String",
        required: true,
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
});

servicesSchema.post("save", (error, doc, next) => {
    healthChecks.startHealthCheck();
    next();
});
const Services = mongoose.model("Services", servicesSchema);
module.exports = Services;
