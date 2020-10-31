const jwt = require('jsonwebtoken')
const User = require('../models/user')

const gatewayAuth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        if(!(req.url.includes('setftp')) && user.passwordResetRequired) {
            return res.status(403).send({
                success: false,
                error: 'Please change your password first'
            })
        }
        req.token = token
        req.user = user
        next()
    }
    catch(e) {
        res.status(401).send({
            success: false,
            error: 'Please authenticate!'
        })
    }
    
}

module.exports = gatewayAuth