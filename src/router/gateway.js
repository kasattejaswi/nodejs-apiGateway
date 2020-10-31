const express = require('express')
const router = express.Router()
const User = require('../models/user')
const permissions = require('../statics/permissions')
const gatewayAuth = require('../middleware/gatewayAuth')
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
            success: false,
            error: 'BAD REQUEST!! Some passed parameters are either empty or invalid'
        })
    }
    try {
       const user = await User.findByCredentials(req.body.username, req.body.password)
       const token = await user.generateToken()
       res.status(200).send({
           success: true,
           user,
           token
       })
        
    }
    catch(e) {
        res.status(404).send({
            success: false,
            error: e.message
        })
    }
    
})

router.post('/gateway/user',gatewayAuth, async (req, res) => {
    if(!req.user.permissions.includes('CREATE_USERS')) {
        return res.status(403).send({
            success: false,
            error: 'Operation not permitted'
        })
    }
    const isValidRequest = checkValidRequest(Object.keys(req.body), ['username', 'password', 'role', 'fullname'])
    if(!isValidRequest) {
        return res.status(400).send({
            success: false,
            error: 'BAD REQUEST!! Some passed parameters are either empty or invalid'
        })
    }
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role ? req.body.role : 'reader',
        permissions: req.body.role ? permissions[req.body.role] : permissions['reader'],
        fullname: req.body.fullname ? req.body.fullname : 'Anonymous User',
        passwordResetRequired: true
    })
    try {
        await user.save()
        res.status(201).send({
            success: true,
            user
        })
    }
    catch(e) {
        res.status(400).send({
            success: false,
            error: e.message
        })
    }
})

router.patch('/gateway/user', gatewayAuth, async(req,res) => {
    const isValidRequest = checkValidRequest(Object.keys(req.body), ['username', 'fullname'])
    if(!isValidRequest) {
        return res.status(400).send({
            success: false,
            error: 'BAD REQUEST!! Some passed parameters are either empty or invalid'
        })
    }
    try {
        Object.keys(req.body).forEach((key) => req.user[key] = req.body[key]);
        await req.user.save();
        res.status(200).send({
        success: 'User updated successfully',
        user: req.user,
        });
    } catch (e) {
        res.status(500).send({
          error: 'Some error occurred',
          message: e.message,
        })
    }
})

router.get('/gateway/usernameUnique', gatewayAuth, async(req, res) => {
    if(!req.body.username) {
        return res.status(400).send({success: false, error: 'Pass a username'})
    }
    try {
        const user = await User.findOne({username: req.body.username})
        if(user) {
            res.send({success: true, isUnique: false})
        } else {
            res.send({success: true, isUnique: true})
        }
    }
    catch(e) {
        res.status(500).send({
            error: 'Some error occurred',
            message: e.message,
          })
    }
    
})

router.post('/gateway/setftp',gatewayAuth, async(req, res) => {
    const isValidRequest = checkValidRequest(Object.keys(req.body), ['password'])
    if(!isValidRequest || !req.body.password) {
        return res.status(400).send({
            success: false,
            error: 'BAD REQUEST!! Some passed parameters are either empty or invalid'
        })
    }
    if(!req.user.passwordResetRequired) {
        return res.status(403).send({
            success: false,
            error: 'Password change is not required'
        })
    }
    req.user.password = req.body.password
    req.user.passwordResetRequired = false
    try {
        await req.user.save()  
        res.send({
            success: true,
            message: 'Password changed successfully'
        })
    }
    catch(e) {
        res.status(400).send({
            success: false,
            error: e.message
        })
    }
})

router.get('/gateway/logout',gatewayAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send({
            success: true,
            message: 'User logged out successfully'
        })    
    }
    catch(e) {
        res.status(500).send({
            success: false,
            error: 'Some internal error occurred',
          });
    }
    
})

router.get('/gateway/logoutAll', gatewayAuth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({
            success: true,
            message: 'Logged out from all sessions successfully'
        })
    } catch(e) {
        res.status(500).send({
            success: false,
            error: 'Some internal error occurred',
          });
    }
})

module.exports = router