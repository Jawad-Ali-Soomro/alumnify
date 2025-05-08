const express = require("express");
const { newUser } = require("../controllers");
const userRouter = express.Router();

userRouter.post('/', newUser)

module.exports = userRouter;
