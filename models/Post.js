const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 80  
    },
    location: {
        type: String,
        required: [true, 'Please provide name']
    },
    image: {
        type: String,
        required: [true, 'Please provide image'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});

module.exports = mongoose.model('Posts', PostSchema);

