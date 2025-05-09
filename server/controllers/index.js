const { createPost, getPosts, toggleLikePost } = require("./post.controller");
const { newUser, loginUser } = require("./user.controllers");

module.exports = {newUser, loginUser, createPost, getPosts, toggleLikePost}