//authentication middleware
//gets token from header and verifies token
//if token is good, persist payload to req obj
//and go to next middleware
//otherwise throw error

const jwt = require('jsonwebtoken');
const CustomError = require('../errors/CustomError');
const StatusCodes = require('http-status-codes');

const authUser = (req, res, next) => {
    if(!req.headers.authorization || !req.headers.authorization.includes('Bearer')) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid Token');
    }

    const token = req.headers.authorization.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(!payload) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid Token');  
    }

    req.user = payload;
    next();
}

module.exports = authUser;
