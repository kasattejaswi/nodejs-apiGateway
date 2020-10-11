const express = require('express')
const router = express.Router()

// Endpoints needed
// Login to gateway
// GET all services
// Update services
// Get all routes of a service
// Update routes of that service
// Get the health statuses of all services
// Logout from gateway


router.post('/gateway/login', (req, res) => {
    res.send({
        success: 'Gateway is running'
    })
})

module.exports = router