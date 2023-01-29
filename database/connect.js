//function that connects to the database
//async, takes in url argument
//where url is our connect string

const mongoose = require('mongoose');
const connect = async (url) => {
    mongoose.set('strictQuery', false);
    return mongoose.connect(url)
}

module.exports = connect;