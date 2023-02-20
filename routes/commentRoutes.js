const express = require('express');
const router = express.Router();

const {
    createComment,
    deleteComment,
    getComment,
    updateComment
} = require('../controllers/commentController');

//create: we need post id
//delete: we need comment id
//get: we need post id
//update: we need comment id

router.get('/', getComment); //we need post id passed in as a querystring
router.post('/', createComment); //we need post id passed in as a querystring
router.delete('/:id', deleteComment);
router.patch('/:id', updateComment);

module.exports = router;