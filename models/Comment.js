const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'Posts',
        required: [true, 'need user to make comment']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: [true, 'need user to make comment']
    },
    description: {
        type: String,
        maxlength: 200,
        required: [true, 'please provide comment description']
    }
}, {timestamps: true})

module.exports = mongoose.model('Comments', CommentSchema);

