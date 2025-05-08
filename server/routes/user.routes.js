const express = require("express");
const { newUser, loginUser } = require("../controllers");
const userRouter = express.Router();

userRouter.post('/', newUser)
userRouter.post('/login', loginUser)

module.exports = userRouter;
