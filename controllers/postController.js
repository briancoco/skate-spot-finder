//contains post controller functions
const Post = require('../models/Post');
const CustomError = require('../errors/CustomError');
const StatusCodes = require('http-status-codes');
const path = require('path');

const createPost = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const post = await Post.create(req.body);

    res.status(StatusCodes.CREATED).json({post});
}

const getPost = async (req, res) => {
    const posts = await Post.find({});

    res.status(StatusCodes.OK).json({posts});
}

const getSinglePost = async (req, res) => {
    const {id: postId} = req.params;
    const post = await Post.findOne({_id: postId});

    if(!post) {
        throw new CustomError(StatusCodes.NOT_FOUND, `No post with id:${postId}`);
    }
    res.status(StatusCodes.OK).json({post});
}

const updatePost = async (req, res) => {
    const {name, location} = req.body;
    const {id: postId} = req.params;
    const {userId} = req.user;

    const post = await Post.findOne({_id: postId});
    if(!post || String(post.createdBy) !== userId) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Post not found or post not created by user');
    }
    post.name = name;
    post.location = location;
    await post.save();

    res.status(StatusCodes.OK).json({post});

}

const deletePost = async (req, res) => {
    const {id: postId} = req.params;
    const {userId} = req.user;

    const post = await Post.findOne({_id: postId});
    if(!post || String(post.createdBy) !== userId) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, 'Post not found or post not created by user');
    }

    await post.delete();

    res.status(StatusCodes.OK).json({msg: 'Post deleted successfully'});
    
}

const uploadImage = async (req, res) => {
    const image = req.files.image;
    if(!image || !image.mimetype.includes('image')) {
        throw new CustomError(StatusCodes.BAD_REQUEST, 'Please provide image');
    }
    
    //get static asset file path
    const savePath = path.join(__dirname, '..', 'public', 'images', `${image.name}`);
    console.log(savePath);
    await image.mv(savePath);
    console.log(image.name);
    res.status(StatusCodes.OK).json({image: `/images/${image.name}`})
}


module.exports = {
    createPost,
    getPost,
    getSinglePost,
    updatePost,
    deletePost,
    uploadImage
};