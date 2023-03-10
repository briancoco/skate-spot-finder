//user schema
//this is a blueprint for creating a user
//it defines the constraints inplace to create a user

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        },
        unique: [true, 'Email already in use']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    profilePicture: {
        type: String,
        default: '/images/defaultUser.png'
    }
});

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function() {
    //create jwt token 
    //payload: userId, email
    const token = jwt.sign({userId: this._id, email: this.email}, process.env.JWT_SECRET, {
        expiresIn:'1d'
    })
    return token;
}

UserSchema.methods.comparePassword = async function(password) {
    //compares passwords and returns true/false accordingly
    isValidPassword = await bcrypt.compare(password, this.password);
    return isValidPassword;
}

UserSchema.methods.attachTokenToCookie = function(res, token) {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        signed: process.env.COOKIE_SECRET
    })
}

module.exports = mongoose.model('Users', UserSchema);