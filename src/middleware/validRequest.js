const readConfigs = require("../configs/readConfigs");
const ReadConfigs = new readConfigs();

const validateRequest = (req, res, next) => {
    const url = req.path;
    const method = req.method;
    const contextRoot = "/" + url.split("/")[1];
    const path = url.replace(contextRoot, "");
    const destinationService = ReadConfigs.getDestinationService(contextRoot, path, method);
    if(!destinationService.isValid) {
        return res.status(400).send({
                    error: 'Your request is not valid !!'
                })
    }
    req.destinationService = destinationService
    req.destinationPath = path
    req.destinationMethod = method
    req.destinationHeaders = req.headers
    req.destinationBody = req.body
    next()
}

module.exports = validateRequest