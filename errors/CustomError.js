const { stat } = require("fs");

class CustomError extends Error {
    //custom error class which adds status code property
    // this will allow us to send more meaningful data to
    //our error middleware which inturn gives us more meaningful
    //error messages
    constructor(statusCode, msg) {
        super(msg);
        this.statusCode = statusCode;
    }
}

module.exports = CustomError;