const User = require("./user.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

function validationError(error) {
  return error instanceof mongoose.Error.ValidationError;
}

function isMongoError(error) {
  return error.code === 11000;
}

async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const hasUser = await User.findOne({ email }).lean();

    if (hasUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salRounds = 10;
    const salt = await bcrypt.genSalt(salRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hashedPassword });
    const userWithoutPass = { email: user.email, _id: user._id };

    req.session.user = userWithoutPass;

    return res.status(200).json(userWithoutPass);
  } catch (error) {
    if (validationError(error)) {
      return res.status(400).json({ message: error.message });
    }
    if (isMongoError(error)) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).lean();
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not found, please signup" });
    }

    const hasCorrectPassword = await bcrypt.compare(password, user.password);
    if (hasCorrectPassword) {
      const userWithoutPass = {
        email: user.email,
        _id: user._id,
        role: user.role,
      };
      console.log(userWithoutPass);
      req.session.user = userWithoutPass;
      return res.status(200).json(userWithoutPass);
    }

    return res.status(400).json({ message: "wrong passwords" });
  } catch (error) {
    if (validationError(error)) {
      return res.status(400).json({ message: error.message });
    }
    if (isMongoError(error)) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    await req.session.destroy();
    return res.status(200).json({ message: "logout" });
  } catch (err) {
    res.status(500).json({ error: err.messages });
  }
}

async function getLoggedInUser(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.messages });
  }
}

// gell all users
async function getUsers(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    const users = await User.find().lean();
    console.log(users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.messages });
  }
}

//get user by Id

async function getRole(req, res) {
  try {
    const userId = req.session?.user?._id;
    const user = await User.findById(userId);
    const role = user.role;
    console.log(role); //mentee
    //_id: new ObjectId("62005ce44d0e0fd37c6e7711"),
    // email: 'k300@mail.com',
    // password: '$2a$10$IR/LcWuHWh9RM7t8nkLj0uQAYPKqfVCZJps3R9Qk6aqYa1K7UeuMm',
    // role: 'mentee',
    // __v: 0
    if (!userId) {
      return res.status(400).json(null);
    }
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ error: err.messages });
  }
}

// Like comments
// likedComments: "/users/:userId/likes"
async function likedUsers(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    // user that the currentUser which is logged in likes
    const { userId } = req.params;

    const currentUserId = req.session?.user?._id;
    
    await User.findByIdAndUpdate(currentUserId, { // in the User model
      $push: {likedUsers: userId}, // push the commentId into -> User.likedComments = [ ]
      new: true
    }).lean();

    // update the profile or user which receives the like by currentUser logged in
    // userId--> user that the currentUser likes
    //currentUserId --> the user logged in that likes another user
    await User.findByIdAndUpdate(userId,  {
      $push: {likedBy: currentUserId}, // likedBy the currentUser
      new: true
    }).lean();

    // const commentData = await Comment.findByIdAndUpdate(commentId, {
    //   $push: { likedBy: userId },
    //   new: true,
    // }).lean();
    // console.log(commentData)

 
    const likedUsersList = await User.findById(currentUserId).populate("likedUsers").lean();
    //console.log(likedUsersList.likedUsers)
    //const likedUsersList = await User.findById(currentUserId).populate("likedUsers likedComments likedPosts").lean();

    console.log('likedUserList', likedUsersList.likedUsers)
    

    res.status(200).json(likedUsersList.likedUsers).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

module.exports = {
  signup,
  login,
  logout,
  getLoggedInUser,
  getRole,
  getUsers,
  likedUsers,
};
