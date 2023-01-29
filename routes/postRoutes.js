const express = require('express');
const router = express.Router();

//controllers
const {
    createPost,
    getPost,
    updatePost,
    deletePost,
    uploadImage,
    getSinglePost
} = require('../controllers/postController');

router.route('/').get(getPost).post(createPost);

router.route('/:id').get(getSinglePost).patch(updatePost).delete(deletePost);

router.post('/uploadImage', uploadImage);

module.exports = router;