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
    }
});

UserSchema.pre('save', async function() {
    //pre middleware which hashes password before saving to database
    //we first generate our salt, then hash the password
    //salt is a string of random characters which we add to the raw password before hashing
    //this adds an extra layer of protecting in case of database breach
    //makes it so that users with the same password have different hashed passwords

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

module.exports = mongoose.model('Users', UserSchema);