const fs = require('fs')

class HealthUpdates {

    constructor() {
        const filePath = __dirname+"/../../status/health/healthStatus.json"
        const healthFile = JSON.parse(fs.readFileSync(filePath))
        this.healthFilePath = filePath
        this.healthStatus = healthFile
    }

    async updateStatus(serviceName, serviceStatus, lastChecked) {
        let isUpdated = false
        this.healthStatus.forEach((status) => {
            if(status.serviceName === serviceName) {
                status.status = serviceStatus
                status.lastChecked = lastChecked
                isUpdated = true
            } 
        })
        if(this.healthStatus.length === 0 || !isUpdated) {
            this.healthStatus.push({
                serviceName,
                status: serviceStatus,
                lastChecked
            })
        }
        fs.writeFile(this.healthFilePath, JSON.stringify(this.healthStatus), (err) => {
            if(err) {
                throw new Error(err)
            }
        })
        
    }
}

module.exports = HealthUpdates