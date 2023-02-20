const Comment = require('../models/Comment');
const Post = require('../models/Post');
const StatusCodes = require('http-status-codes');
const CustomError = require('../errors/CustomError');


const createComment = async (req, res) => {
    //get postID from req.body
    //check if post exists in our database
    //create comment using postID and userID
    //send back OK response with given post
    const {postId, description} = req.body;
    const post = Post.find({_id: postId});

    if(!post) {
        throw new CustomError(StatusCodes.BAD_REQUEST, `No post with id: ${postId}`);
    }

    const comment = await Comment.create({post: postId, user: req.user.userId, description});
    
    res.status(StatusCodes.CREATED).json({comment});
}

const deleteComment = async (req, res) => {
    const {id: commentId} = req.params;

    await Comment.deleteOne({_id: commentId});

    res.status(StatusCodes.OK).json({msg: 'delete successful'});
}

const getComment = async (req, res) => {
    const {postId} = req.body;

    const comments = await Comment.find({post: postId});

    res.status(StatusCodes.OK).json(comments);
}

const updateComment = async (req, res) => {
    //gets new comment description from request body
    //then finds and updates comment
    const {description} = req.body;
    const {id: commentId} = req.params;

    const comment = await Comment.findOneAndUpdate({_id: commentId}, {description}, {
        runValidators: true,
        new: true
    });

    res.status(StatusCodes.OK).json({comment});
}


module.exports = {
    createComment,
    deleteComment,
    getComment,
    updateComment
}