// getPosts: "/posts", //get - all posts by post
// getPostById: "/posts/:postId", // get - get details by id
// createPost: "/posts", /post - create new comment 
// updatePost: "/posts/:postId", //post - update 
// deletePost: "/posts/:postId", // post

const Post = require("./post.model");
const mongoose = require("mongoose");

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all posts by userId 
// get -> getPostsByAuthor - /posts",
async function getPostsByAuthor(req, res) {
    try {
      const userId = req.session?.user?._id;
      console.log(req.session.user)
      //user: { email: 'k300@mail.com', _id: '62005ce44d0e0fd37c6e7711' }
  
      const posts = await Post.find({ author: userId })
        .populate("comments")
        .lean();
      res.status(200).json(posts).end();
    } catch (err) {
      res.status(400).json(err.message).end();
    }
  }

// Get all posts 
// get -> getPostsByAuthor - /posts",
async function getPosts(req, res) {
  try {
    const userId = req.session?.user?._id;
    console.log(req.session.user)
    //user: { email: 'k300@mail.com', _id: '62005ce44d0e0fd37c6e7711' }

    //const posts = await Post.find({ author: userId })
    const posts = await Post.find()
      .populate("author comments") //--> we are saying: give me whole user object with this ID (author represents an ID in our case)
      .lean();
    res.status(200).json(posts).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Get all details of the post
// get -> getPostsByAuthor - /posts",
async function getPostById(req, res) {
  try {
    const { postId } = req.params;
    if (!isObjectId(postId)) {
      res.status(400).json("Id not valid").end();
    }

    const post = await Post.findById(postId)
    .populate("author comments")
    // inside 'author' populate the information of the user
    .populate({
        // we are populating author in the previously populated comments
        path: 'comments',
        populate: {
          path: 'author', // go to property -> author
          model: 'User' // use the 'User' model information
        }
    })
    .lean();
    console.log(post)
    res.status(200).json(post).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Create a post
// post -> createPost - /posts",
async function createPost(req, res) {
  try {
    const userId = req.session?.user?._id;
    const post = await Post.create({ ...req.body, author: userId });
     // when the new post is created, the user needs to be found and its posts updated with the
      // ID of newly created post
     const update = await User.findByIdAndUpdate(userId, { // in the User model
        $push: {posts: post_id} // pusth the post_id into -> User.author.posts = [ ]
    }, { new: true });
    res.status(200).json(post).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Update a post
// updatePost: "/posts/:postId", //post - update 
// the user only can update: content or title of the post
async function updatePost(req, res) {
  try {
    const userId = req.session?.user?._id;
    const { postId } = req.params;
    if (!isObjectId(postId)) {
      res.status(400).json("Id not valid").end();
    }
    const post = await Post.findByIdAndUpdate(postId, req.body, { 
      new: true,
    }).lean();

    res.status(200).json(post).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// deletePost: "/posts/:postId", // post
async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    if (!isObjectId(postId)) {
      res.status(400).json("Id not valid").end();
    }
    const post = await Post.findByIdAndDelete(postId).lean();
    res.status(200).json(post).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

module.exports = {
  getPostById,
  getPostsByAuthor,
  getPosts,
  updatePost,
  createPost,
  deletePost,
};
