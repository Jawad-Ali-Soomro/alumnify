const express = require('express');
const { createPost, getPosts, toggleLikePost } = require('../controllers');
const postRouter = express.Router();

postRouter.post("/", createPost)
postRouter.get("/all", getPosts)
postRouter.post("/toggle/like/:postId", toggleLikePost)

module.exports = postRouter;