const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 80  
    },
    location: {
        address: {
            type: String,
            default: 'N/A'
        },
        city: {
            type: String,
            default: 'N/A'
        },
        state: {
            type: String,
            default: 'N/A'
        },

    },
    description: {
        type: String,
        default: 'No post description'
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

