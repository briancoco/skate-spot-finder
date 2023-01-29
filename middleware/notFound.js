//if the incoming request is is not one of our defined routes
//then request will go here instead where we'll send back
//a 404 response
const StatusCodes = require('http-status-codes');
const notFoundMiddleware = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('Route does not exist');
}

module.exports = notFoundMiddleware;