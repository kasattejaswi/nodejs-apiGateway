const app = require('./app')

app.listen(process.env.SERVICE_API_GATEWAY_PORT, () => {
    console.log(`Service API GATEWAY is running on port  ${process.env.SERVICE_API_GATEWAY_PORT}`)
})