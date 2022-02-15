const User = require("./user.model");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

function validationError(error) {
  return error instanceof mongoose.Error.ValidationError;
}

function isMongoError(error) {
  return error.code === 11000;
}

// Post signup
// api/signup
async function signup(req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    // const { email, password } = req.body;
    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: "Email and password are required" });
    // }
    const hasUser = await User.findOne({ email }).lean();


    if (hasUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salRounds = 10;
    const salt = await bcrypt.genSalt(salRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ email, password: hashedPassword, role: role });
    //const user = await User.create({ email, password: hashedPassword });
    const userWithoutPass = { email: user.email, _id: user._id, role: user.role };

    req.session.user = userWithoutPass;
    
    return res.status(200).json(userWithoutPass);
  } catch (error) {
    if (validationError(error)) {
      return res.status(400).json({ message: error.message }).end();
    }
    if (isMongoError(error)) {
      return res.status(400).json({ message: error.message }).end();
    }
    return res.status(500).json({ message: error.message }).end();
  }
}

// Post login
// api/login
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
        role: user?.role, //set role 
      };
      console.log(userWithoutPass);
      req.session.user = userWithoutPass;
      return res.status(200).json(userWithoutPass);
    }

    return res.status(400).json({ message: "wrong passwords" }).end();
  } catch (error) {
    if (validationError(error)) {
      return res.status(400).json({ message: error.message }).end();
    }
    if (isMongoError(error)) {
      return res.status(400).json({ message: error.message }).end();
    }
    return res.status(500).json({ message: error.message }).end();
  }
}

// Post logout
async function logout(req, res) {
  try {
    await req.session.destroy();
    return res.status(200).json({ message: "logout" });
  } catch (err) {
    res.status(500).json({ error: err.messages }).end();
  }
}

// Get - login
// api/login
async function getLoggedInUser(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.messages }).end();
  }
}

//Update profile 
// /api/users/:userId/profile,
async function updateUser(req, res) {
  try {
    const currentUserId = req.session?.user?._id;
    const {userId} = req.params;
    if (!currentUserId) {
      return res.status(400).json(null);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).lean();

    res.status(200).json(updatedUser).end();

  } catch(err) {
    res.status(500).json({error:err.messages}).end();
  }
}

// Get users
// /api/users
//http://localhost:4000/api/users
async function getUsers(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    const users = await User.find().lean();
    console.log(users);
    res.status(200).json(users).end();
  } catch (err) {
    res.status(500).json({ error: err.messages }).end();
  }
}

// Get user by id
//get user by Id - /api/user/:userId
//http://localhost:4000/api/users/62028338c78e447fe962fb74
async function getUserById(req, res) {
  try {
    const user = req.session?.user;
    if (!user) {
      return res.status(400).json(null);
    }
    // api/user/:userId
    const { userId } = req.params;
    console.log(userId);

    const userData = await User.findById(userId)
      .populate("posts comments likedUsers likedComments likedPosts likedBy")
      .lean();
    console.log(userData);
    //console.log(userData.likedBy.name)

    const likedByArr = userData.likedBy.map((item) => {
      return {
        id: item._id,
        name: item.name,
        email: item.email,
      };
    });

    const key = 'email';
    //filter array with unique objects javascript
  const likedByUnique = [...new Map(likedByArr.map(item =>[item[key], item])).values()];
    // const likedByArr = userData.likedBy.map((item) => {
    //   return { email: item.email }
    // });
    // console.log(likedByArr)

    //eliminate duplicates
    // const uniqueArr = [...new Set(likedByArr.map(item => item.email))];
    // // ['karla', 'sammy']
   
   
    // const uniqueObj = uniqueArr.map((item) => {
    //   return {
    //     email: item,
    // }
    // })

    // console.log('uniqueObj', uniqueObj);

    //[ { email: 'k1@mail.com' }, { email: 'sammy@mail.com' } ]
  
    
    // const result = likedByArr.filter(({ email: item1 }) => uniqueObj.some(({ email: item2 }) => item2 === item1));

  //likedByUnique -> constant send in the response, but not saved in MongoDb
    res
      .status(200)
      .json({...userData, likedByUnique })
      .end();
  } catch (err) {
    res.status(500).json({ error: err.messages }).end();
  }
}

// Get Role
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
    res.status(200).json(role).end();
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

    await User.findByIdAndUpdate(currentUserId, {
      // in the User model
      $push: { likedUsers: userId }, // push the commentId into -> User.likedComments = [ ]
      new: true,
    }).lean();

    // update the profile or user which receives the like by currentUser logged in
    // userId--> user that the currentUser likes
    //currentUserId --> the user logged in that likes another user
    await User.findByIdAndUpdate(userId, {
      $push: { likedBy: currentUserId }, // likedBy the currentUser
      new: true,
    }).lean();

    const likedUsersList = await User.findById(currentUserId)
      .populate("likedUsers")
      .lean();
    //console.log(likedUsersList.likedUsers)
    //const likedUsersList = await User.findById(currentUserId).populate("likedUsers likedComments likedPosts").lean();

    console.log("likedUserList", likedUsersList.likedUsers);

    res.status(200).json(likedUsersList.likedUsers).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}



// Mentee book a mentor
//Put 

// Update profile
// Post - /api/user/:userId/mentor
// Mentee goes to --> users and click on one Mentor--> user/:userId
async function bookedMentor(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    // /api/user/:userId -> mentor
    // userId--> Mentor 
    const { userId } = req.params;

    // currentUserId -> mentee logged in who is looking for a Mentor
    const currentUserId = req.session?.user?._id;

    // --> check if the user is Mentee to book for a Mentor
    const currentUser= await User.findById(currentUserId);
    const isMentee = currentUser.role; // mentee
    console.log(isMentee); //mentee

    //  // --> check if the user is Mentee to book for a Mentor
    const userUrl = await User.findById(userId);
    const isMentor = userUrl.role; // mentee
    console.log(isMentor); //mentee
    
    // Check if it's a mentee to book a mentor
    // role 'user' cannot booked a mentor
    if(isMentee !== 'mentee' || isMentor !== 'mentor') {
      return res.status(200).json({ message: "Sorry! you need to be a Mentee!" });
    }
    //--> push the 'id' of the mentor inside my array of Mentors --> bookedMentor = []
    await User.findByIdAndUpdate(currentUserId, {
      $push: {bookedMentor: userId},
      new: true,
    }).lean();
    //--> push the 'id' of the mentee inside Mentor --> bookedMentorBy = []
    await User.findByIdAndUpdate(userId, {
      $push: {bookedMentorBy: currentUserId},
      new: true,
    }).lean()
    
    // Populate bookedMentor -> to get the whole object
    const bookedMentorList = await User.findById(currentUserId)
    .populate("bookedMentor")
    .lean();

    console.log("bookedMentorList", bookedMentorList.bookedMentor);
    // Get List of Mentors -> id,name, email
    const bookedMentorArr = bookedMentorList.bookedMentor.map((item) => {
      return {
        id: item._id,
        name: item.name,
        email: item.email,
      };
    });

    //filter array with unique objects javascript
    const key = 'email';
    
    const bookedMentorUnique = [...new Map(bookedMentorArr.map(item =>[item[key], item])).values()];
    //console.log('bookedMentorUnique', bookedMentorUnique)

    res.status(200).json(bookedMentorUnique).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// UPDATE - PUT - /api/profile/:role
async function updateRole(req, res) { 
  try {
    const currentUserId = req.session?.user?._id;
    const {role} = req.params;
    if (!currentUserId) {
      return res.status(400).json(null);
    }
    const updatedRole = await User.findByIdAndUpdate(currentUserId, {
      role: `${role}`
    }, {
      new: true,
    }).lean();
    console.log(updatedRole)

    res.status(200).json(updatedRole).end();

  } catch(err) {
    res.status(500).json({error:err.messages}).end();
  }
}

// Mentee --->> Book the Mentor
// await User.findByIdAndUpdate(currentUserId, { // current user logged in
//   // in the User model
//   $push: { bookedMentor: userId }, // push the mentor inside the current user
//   new: true,
// }).lean();

// Mentor --->> Can see who is asking for Booking
// await User.findByIdAndUpdate(userId, { //mentor
//   // in the User model
//   $push: { bookedMentorBy: currentUserId, }, // push the mentor inside the current user
//   new: true,
// }).lean();

// Get mentors
// /api/mentors
//http://localhost:4000/api/mentors
async function getMentors(req, res) {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(400).json(null);
    }
    const mentors = await User.find({role: 'mentor'}).lean();
    console.log(mentors);
    res.status(200).json(mentors).end();
  } catch (err) {
    res.status(500).json({ error: err.messages }).end();
  }
}




module.exports = {
  signup,
  login,
  logout,
  getLoggedInUser,
  updateUser,
  getRole,
  getUsers,
  getUserById,
  likedUsers,
  bookedMentor,
  updateRole,
  getMentors,
};





