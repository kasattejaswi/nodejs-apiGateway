const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

class User {
    constructor() {
        const usersdata = JSON.parse(fs.readFileSync(__dirname+"/../../users/user.json"))
        this.users = usersdata
    }

    generateToken() {

    }

    saveUser() {

    }

    updatePassword() {

    }
    
}