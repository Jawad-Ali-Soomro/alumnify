const { createPost, getPosts, toggleLikePost } = require("./post.controller");
const { newUser, loginUser, getAllUsers } = require("./user.controllers");

module.exports = {newUser, loginUser, createPost, getPosts, toggleLikePost, getAllUsers}