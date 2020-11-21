const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
    serviceId: {
        type: "String",
        required: true,
        unique: true,
    },
    pingStatus: {
        type: "String",
        required: true,
        validate(status) {
            if (!["ONLINE", "OFFLINE", "UNKNOWN"].includes(status)) {
                throw new Error(
                    "Only ONLINE, OFFLINE and UNKNOWN statuses are allowed"
                );
            }
        },
    },
    lastChecked: {
        type: "String",
        required: true,
    },
});

const Health = mongoose.model("Health", healthSchema);
module.exports = Health;
