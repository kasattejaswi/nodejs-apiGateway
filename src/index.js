const app = require('./app')

app.listen(process.env.GATEWAY_PORT, () => {
    console.log(`Service API GATEWAY is running on port  ${process.env.GATEWAY_PORT}`)
})