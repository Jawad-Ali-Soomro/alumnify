const express = require('express');
const { createPost, getPosts, toggleLikePost, getPostById } = require('../controllers');
const postRouter = express.Router();

postRouter.post("/", createPost)
postRouter.get("/all", getPosts)
postRouter.post("/toggle/like/:postId", toggleLikePost)
postRouter.get("/:id", getPostById)

module.exports = postRouter;