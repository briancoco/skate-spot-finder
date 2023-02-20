//contains the functions (controllers) that run 
//when a given route is hit 
//basically this is where the request handling logic exists

const StatusCodes = require('http-status-codes');
const CustomError = require('../errors/CustomError');
const User = require('../models/User');

const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Please provide both email and password');
    }

    const user = await User.findOne({email});
    if(!user) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');
    }

    isValidPassword = await user.comparePassword(password);
    if(!isValidPassword) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid Credentials');        
    }

    const token = user.createJWT();

    user.attachTokenToCookie(res, token);
    res.status(StatusCodes.OK).json({msg: "User sucessfully logged in"});
}

const register = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Please provide both email and password');
    }

    const user = await User.create({email, password});
    const token = user.createJWT();

    user.attachTokenToCookie(res, token);

    res.status(StatusCodes.CREATED).json({msg: "User sucessfully registered"});
}

module.exports = {
    login,
    register
}