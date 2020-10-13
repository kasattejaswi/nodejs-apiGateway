const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const permissions = require('../statics/permissions')

class Users {
    constructor() {
        const path = __dirname+"/../../users/user.json"
        this.path = path
        const usersdata = JSON.parse(fs.readFileSync(path))
        this.users = usersdata
    }

    async createNewAccount(username, password, role) {
        const encryptedPassword = await bcrypt.hash(password, 8)
        if(this.findUser(username) > -1) {
            throw new Error('Username must be unique')
        }
        if(!permissions[role]) {
            throw new Error('Invalid permission')
        }
        let tokens = []
        this.users.push({
            username,
            password: encryptedPassword,
            role,
            permissions: permissions[role],
            tokens: tokens.concat(this.generateToken(username, permissions[role]))
        })
        this.save()
    }
    async loginToAccount(username, password) {
        const userIndex = this.findUser(username)
        const user = this.users[userIndex]
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch) {
            const token = this.generateToken(user.username, user.permissions)
            this.users[userIndex].tokens.push(token)
            this.save()
            return {
                username: user.username,
                role: user.role,
                permissions: user.permissions,
                token: token
            }
        }
    }

    verifyToken(token) {
        const decoded = jwt.verify(token, 'mysecret')
        const userIndex = this.findUser(decoded.username)
        const user = this.users[userIndex]
        if(user.tokens.includes(token)) {
            return {
                username: user.username,
                role: user.role,
                permissions: user.permissions,
            }
        }
    }

    generateToken(username, permissions) {
        const token = jwt.sign({
            username,
            permissions
        }, 'mysecret')
        return token
    }

    findUser(username) {
        for(let user of this.users) {
            if(user.username === username) {
                return this.users.indexOf(user)
            }
        }
    }

    updatePassword(username, oldPassword, newPassword) {
        
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.users), (err) => {
            if(err) {
                throw new Error(err)
            }
        })
    }
    
}

const users = new Users()
// users.createNewAccount('kasattejaswinew', 'password@12345', 'admin')
// users.loginToAccount('kasattejaswi','password@12345').then(user => console.log(user))
// console.log(users.verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imthc2F0dGVqYXN3aSIsInBlcm1pc3Npb25zIjpbIlJFQURfVVNFUlMiLCJDUkVBVEVfVVNFUlMiLCJVUERBVEVfVVNFUlMiLCJERUxFVEVfVVNFUlMiLCJDSEFOR0VfVVNFUl9ST0xFUyIsIlJFQURfU0VSVklDRVMiLCJDUkVBVEVfU0VSVklDRVMiLCJVUERBVEVfU0VSVklDRVMiLCJERUxFVEVfU0VSVklDRVMiLCJSRUFEX1JPVVRFUyIsIkNSRUFURV9ST1VURVMiLCJVUERBVEVfUk9VVEVTIiwiREVMRVRFX1JPVVRFUyIsIlJFQURfREVGSU5JVElPTlMiLCJVUERBVEVfREVGSU5JVElPTlMiLCJERUxFVEVfREVGSU5JVElPTlMiLCJSRUFEX1NFUlZJQ0VfU1RBVFVTIiwiQVBQUk9WRV9NT0RJRklDQVRJT05TIiwiUkVKRUNUX01PRElGSUNBVElPTlMiLCJBVVRPX0FQUFJPVkUiXSwiaWF0IjoxNjAyNDkxMDczfQ.4mtrc5MMvPbVYchJRnPZqGOnN45dDoc4QV3LBuejdDE'))

module.exports = Users