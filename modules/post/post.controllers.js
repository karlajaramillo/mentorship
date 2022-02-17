// getPosts: "/posts", //get - all posts by post
// getPostById: "/posts/:postId", // get - get details by id
// createPost: "/posts", /post - create new comment
// updatePost: "/posts/:postId", //post - update


const Post = require("./post.model");
const User = require("../auth/user.model");
const mongoose = require("mongoose");

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all posts by userId
// get -> getPostsByAuthor - /posts/:userId/author",
async function getPostsByAuthor(req, res) {
  try {
    const currentUserId = req.session?.user?._id;
    console.log(req.session.user);

    const { userId } = req.params;
    console.log('user', userId)

    //user: { email: 'k300@mail.com', _id: '62005ce44d0e0fd37c6e7711' }
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 } )
      .populate("comments")
      .lean();
    res.status(200).json(posts).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Get all posts
// get -> getPosts - /posts",
async function getPosts(req, res) {
  try {
    const userId = req.session?.user?._id;
    //user: { email: 'k300@mail.com', _id: '62005ce44d0e0fd37c6e7711' }

    const posts = await Post.find()
      .sort({ createdAt: -1})
      .populate("author comments") //--> we are saying: give me whole user object with this ID (author represents an ID in our case)
      .lean();
    res.status(200).json(posts).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Get all details of the post
// get -> getPostsById - /posts/:postId",
async function getPostById(req, res) {
  try {
    //const userId = req.session?.user?._id;
    const { postId } = req.params;
    console.log(postId)
    if (!isObjectId(postId)) {
      res.status(400).json("Id not valid").end();
    }


    console.log('postId', postId)
    
    const post = await Post.findById(postId)
       .populate("author comments likedBy")
      // //inside 'author' populate the information of the user
      .populate({
        // we are populating author in the previously populated comments
        path: "comments",
        populate: {
          path: "author", // gives all the 'author', which is the whole user--> from 'User model'
          model: "User", // use the 'User' model information
        },
      })
      .lean();
    console.log('my post', post);

    // const likedBy = post?.likedBy?.map(item => {
    //   return {
    //     id: item?._id,
    //     name: item?.name,
    //     email: item?.email
    //   }
    // })
    // console.log(post)
    // //console.log(likedBy)
    // if (post?.likedBy) {

    //   res.status(200).json({...post, likedBy}).end();
    // }

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
    console.log(post);
    console.log(post._id);
    console.log(post.author);
    console.log(userId);
    //console.log(author)

    await User.findByIdAndUpdate(userId, {
      // in the User model
      $push: { posts: post._id }, // push the post_id into -> User.author.posts = [ ]
      new: true,
    });
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

// Like post
// likedPost: "/posts/:postId/likes
async function likedPosts(req, res) {
  try {
    const userId = req.session?.user?._id;
    const { postId } = req.params;
    if (!isObjectId(postId)) {
      res.status(400).json("Id not valid").end();
    }
    console.log("user", userId);
    console.log("post", postId);
    await User.findByIdAndUpdate(userId, {
      // in the User model
      $push: { likedPosts: postId }, // push the post_id into -> User.author.posts = [ ]
      new: true,
    }).lean();
    // const likedPostsList = await User.findById(userId).populate("likedPosts").lean();
    // console.log(likedPosts)

    // const post = await Post.findById(postId)

    const post = await Post.findByIdAndUpdate(postId, {
      $push: { likedBy: userId },
      new: true,
    }).lean();

    // react makes the count with the response 
    post.likes = post.likedBy.length;// computed field --> don't keep it in the database

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
  likedPosts,
  deletePost,
};
