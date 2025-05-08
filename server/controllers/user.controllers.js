const { signToken } = require("../middlewares");
const { User } = require("../models");

const newUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const newUser = await User.create({
    name,
    email,
    password,
  });

  const token = await signToken(newUser)

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    role: newUser.role,
    token
  });
};

module.exports = {
  newUser,
};
