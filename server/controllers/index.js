const { createPost, getPosts, toggleLikePost , getPostById, deletePost} = require("./post.controller");
const { newUser, loginUser, getAllUsers } = require("./user.controllers");

module.exports = {newUser, loginUser, createPost, getPosts, toggleLikePost, getAllUsers, getPostById, deletePost }