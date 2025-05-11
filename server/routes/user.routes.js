const express = require("express");
const { newUser, loginUser, getAllUsers, addFriend, removeFriend, getUserById, updateUser } = require("../controllers");
const userRouter = express.Router();

userRouter.post('/', newUser)
userRouter.post('/login', loginUser)
userRouter.get('/all', getAllUsers)
userRouter.post('/add-friend', addFriend)
userRouter.post('/remove-friend', removeFriend)
userRouter.get('/user/:userId', getUserById)
userRouter.put('/update/:userId', updateUser)

module.exports = userRouter;
