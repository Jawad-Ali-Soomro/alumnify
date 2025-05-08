const express = require('express');
const { createPost, getPosts } = require('../controllers');
const postRouter = express.Router();

postRouter.post("/", createPost)
postRouter.get("/all", getPosts)

module.exports = postRouter;