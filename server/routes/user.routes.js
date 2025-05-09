const express = require("express");
const { newUser, loginUser, getAllUsers } = require("../controllers");
const userRouter = express.Router();

userRouter.post('/', newUser)
userRouter.post('/login', loginUser)
userRouter.get('/all', getAllUsers)

module.exports = userRouter;
