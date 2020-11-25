const fetch = require("node-fetch");
const Services = require("../models/services");
const Health = require("../models/health");

class HealthCheck {
    constructor() {
        this.intervals = [];
    }

    async startHealthCheck() {
        console.log("called");
        if (this.intervals.length > 0) {
            console.log("Clearing all running intervals: " + this.intervals);
            this.intervals.forEach(clearInterval);
        }
        const services = await Services.find({});
        services.forEach((service) => {
            this.intervals.push(
                setInterval(async () => {
                    try {
                        const response = await fetch(
                            `${service.protocol.toLowerCase()}://${
                                service.backendHostname
                            }:${service.port}${service.servicePingEndpoint}`
                        );
                        if (response.status === 200) {
                            let doc = await Health.findOne({
                                serviceId: service._id,
                            });
                            if (doc) {
                                doc.pingStatus = "ONLINE";
                                doc.lastChecked = new Date().toUTCString();
                            } else {
                                doc = new Health({
                                    serviceId: service._id,
                                    pingStatus: "ONLINE",
                                    lastChecked: new Date().toUTCString(),
                                });
                            }
                            await doc.save();
                        } else {
                            let doc = await Health.findOne({
                                serviceId: service._id,
                            });
                            if (doc) {
                                doc.pingStatus = "UNKNOWN";
                                doc.lastChecked = new Date().toUTCString();
                            } else {
                                doc = new Health({
                                    serviceId: service._id,
                                    pingStatus: "UNKNOWN",
                                    lastChecked: new Date().toUTCString(),
                                });
                            }
                            await doc.save();
                        }
                    } catch {
                        let doc = await Health.findOne({
                            serviceId: service._id,
                        });
                        if (doc) {
                            doc.pingStatus = "OFFLINE";
                            doc.lastChecked = new Date().toUTCString();
                        } else {
                            doc = new Health({
                                serviceId: service._id,
                                pingStatus: "OFFLINE",
                                lastChecked: new Date().toUTCString(),
                            });
                        }
                        await doc.save();
                    }
                }, service.pingFrequency)
            );
        });
    }
}

module.exports = HealthCheck;
