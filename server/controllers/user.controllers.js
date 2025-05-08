const { signToken } = require("../middlewares");
const { User } = require("../models");

const newUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Account already exists with this email",
    });
  }
  const newUser = await User.create({
    username,
    email,
    password,
  });

  const token = await signToken(newUser)

  return res.status(201).json({
    success: true,
    user: newUser,
    message: "User created successfully",
    role: newUser.role,
    token
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields",
    });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  const token = await signToken(user)

  return res.status(200).json({
    success: true,
    user:user,
    message: "User logged in successfully",
    role: user.role,
    token
  });
}

module.exports = {
  newUser,
  loginUser
};
