const mongoose = require("mongoose");
const roles = require("../statics/roles");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: "String",
    required: true,
    unique: true,
  },
  fullname: {
    type: "String",
    required: true
  },
  passwordResetRequired: {
    type: 'Boolean',
    required: true
  },
  password: {
    type: "String",
    required: true,
  },
  role: {
    type: "String",
    required: true,
    validate(role) {
      if (!roles.includes(role)) {
        throw new Error("Invalid role");
      }
    },
  },
  permissions: {
    type: [String],
    required: true,
  },
  tokens: [
    {
      token: {
        type: "String",
        required: true,
      },
    },
  ],
});

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  return userObject
};

userSchema.statics.findByCredentials = async (username, password) => {
  let user
  user = await User.findOne({ username })
  if (!user) {
    throw new Error("Unable to find the user")
  } else {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error("Invalid username or password")
    }
    return user
  }
}

userSchema.methods.generateToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString(), permissions: user.permissions, role: user.role }, process.env.JWT_SECRET, {expiresIn: "12h"})
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.post('save', (err, doc, next) => {
    if (err.code === 11000 && err.name === 'MongoError') {
      throw new Error('Username must be unique');
    } else {
      next();
    }
  });
  
const User = mongoose.model("User", userSchema);
module.exports = User;
