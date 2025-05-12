const { createEvent, getAllEvents } = require("./event.controller");
const { createPost, getPosts, toggleLikePost , getPostById, deletePost} = require("./post.controller");
const { newUser, loginUser, getAllUsers, addFriend, removeFriend, getUserById, updateUser } = require("./user.controllers");

module.exports = {newUser, loginUser, createPost, getPosts, toggleLikePost, getAllUsers, getPostById, deletePost, addFriend, removeFriend,getUserById, updateUser, createEvent, getAllEvents }