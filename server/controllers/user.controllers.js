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

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(400).json({
      success: false,
      message: "No users found",
    });
  }
  return res.status(200).json({
    success: true,
    users,
  });
}

const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Check if both users exist
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: "User or friend not found"
      });
    }

    // Check if they're already friends
    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: "Already friends with this user"
      });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    await Promise.all([user.save(), friend.save()]);

    return res.status(200).json({
      success: true,
      message: "Friend added successfully"
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding friend",
      error: error.message
    });
  }
};

const checkFriendship = async (req, res) => {
  try {
    const { userId, friendId } = req.query;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isFriend = user.friends.includes(friendId);
    
    return res.status(200).json({
      success: true,
      isFriend
    });
  } catch (error) {
    console.error("Error checking friendship:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking friendship",
      error: error.message
    });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const [user, friend] = await Promise.all([
      User.findById(userId),
      User.findById(friendId)
    ]);

    if (!user || !friend) {
      return res.status(404).json({
        success: false,
        message: "User or friend not found"
      });
    }

    // Remove friend from both users' friend lists
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await Promise.all([user.save(), friend.save()]);

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully"
    });
  } catch (error) {
    console.error("Error removing friend:", error);
    return res.status(500).json({
      success: false,
      message: "Error removing friend",
      error: error.message
    });
  }
};

const getUserById = async (req,res) => {
  const {userId} = req.params
  const user = await User.findById(userId).populate("friends")
  if(!user) {
    return res.json({
      success: false,
      message: "No Account Found!"
    })
  }else {
    return res.json({
      success:true,
      message:  "Account Found!",
      user
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      updates.password = await bcrypt.hash(updates.password, salt);
    }
  

    updates.updated_at = Date.now();

    const updatedUser = await User.findByIdAndUpdate(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    updatedUser.password = undefined;

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: 'Validation error',
        errors: messages
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists',
        field: 'email'
      });
    }

    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  newUser,
  loginUser,
  getAllUsers,
  addFriend,
  checkFriendship,
  removeFriend,
  getUserById,
  updateUser
};
