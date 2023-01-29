
const mongoose = require('mongoose');
const connect = async (url) => {
    mongoose.set('strictQuery', false);
    return mongoose.connect(url)
}

module.exports = connect;