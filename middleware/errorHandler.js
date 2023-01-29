//error middleware
//if any error is thrown in our controllers
//call will get redirected to this mmiddleware function
//which will send back an approrpriate error message

const CustomError = require('../errors/CustomError');
const StatusCodes = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
    //first we need to determine whether the error was
    //a custom api error or a normal error
    //then we can handle accordingly

    if(err instanceof CustomError) {
        return res.status(err.statusCode).send(err.message);
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
}

module.exports = errorHandlerMiddleware;