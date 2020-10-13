const express = require('express')
const router = express.Router()
const users = require('../objects/user')
const Users = new users()
// Endpoints needed
// Login to gateway - done
// GET all services
// Update services
// Get all routes of a service
// Update routes of that service
// Get the health statuses of all services
// Logout from gateway

const checkValidRequest = (receivedKeys, allowedKeys) => {
    return receivedKeys.every(key => allowedKeys.includes(key))
}

router.post('/gateway/login', async (req, res) => {
    const isValidRequest = checkValidRequest(Object.keys(req.body), ['username', 'password'])
    if(!isValidRequest) {
        return res.status(400).send({
            error: 'BAD REQUEST!! Some passed parameters are either empty or invalid'
        })
    }
    try {
        const user = await Users.loginToAccount(req.body.username, req.body.password)
        if(user) {
            res.status(200).send(user)
        }
        else {
            res.status(404).send({
                error: 'Username or password incorrect'
            })
        }
    }
    catch(e) {
        res.status(500).send({
            error: 'Unable to complete your request'
        })
    }
    
})

router.post('/gateway/logout', (req, res) => {
    res.send({
        success: 'Logged out successfully'
    })
})

module.exports = router