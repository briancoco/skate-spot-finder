//authentication middleware
//gets token from header and verifies token
//if token is good, persist payload to req obj
//and go to next middleware
//otherwise throw error

const jwt = require('jsonwebtoken');
const CustomError = require('../errors/CustomError');
const StatusCodes = require('http-status-codes');

const authUser = (req, res, next) => {
    const token = req.signedCookies.token;
    if(!token) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Please provide token');
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(!payload) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid Token');  
    }

    req.user = payload;
    next();
}

module.exports = authUser;
