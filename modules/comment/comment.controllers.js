const mongoose = require("mongoose");
const Comment = require("./comment.model");
const Post = require("../post/post.model");
const User = require("../auth/user.model");


function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all comments by userId 
// get -> getComments - /comments",
async function getComments(req, res) {
  try {
    const userId = req.session?.user?._id;
    //console.log(req.session.user);
    //user: { email: 'k300@mail.com', _id: '62005ce44d0e0fd37c6e7711' }
    const comments = await Comment.find().lean(); 
    //const comments = await Comment.find({ author: userId }).lean(); 
    //console.log(comments);
    res.status(200).json(comments).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Get one comment by id 
// get -> getCommentById -> /comments/:commentId
async function getCommentById(req, res) {
  try {
    const { commentId } = req.params; // take from params
    console.log(commentId);
    if (!isObjectId(commentId)) {
      res.status(400).json("Id not valid").end();
    }
    const comment = await Comment.findById(commentId).lean();
    console.log(comment);
    res.status(200).json(comment).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Create a new Comment
// post -> posts/:postId/comment",
// the form: content
async function createComment(req, res) {
  try {
    const { postId } = req.params;
    console.log(postId)
    const {content} = req.body; //from the form
    console.log(content)
    const author = req.session?.user?._id;
    // const author = await User.findById(userId); //from the session
    console.log(author);

    // author -> id of user
    const comment = await Comment.create({content, author, postId});
    //console.log(comment)
   

    //update in Post -> comments array
    await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id }, 
        new: true, 
    });

  // update in User -> with the comments array made by this user
   await User.findByIdAndUpdate(author, { // in the User model
      $push: {comments: comment._id}, // push the post_id into -> User.author.posts = [ ]
      new: true 
    });

    res.status(200).json(comment).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Update a comment
// post -> updateComment: "/comments/:commentId"
async function updateComment(req, res) {
  try {
    const { commentId } = req.params; // params
    if (!isObjectId(commentId)) {
      res.status(400).json("Id not valid").end();
    }
    const comment = await Comment.findByIdAndUpdate(commentId, req.body, {
      new: true,
    }).lean();
    console.log(comment);

    res.status(200).json(comment).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

// Like comments
// likedComments: "/comments/:commentId/likes
async function likedComments(req, res) {
  try {
    const userId = req.session?.user?._id;
    const { commentId } = req.params;
    if (!isObjectId(commentId)) {
      res.status(400).json("Id not valid").end();
    }
    console.log('user', userId)
    console.log('comment', commentId)
    await User.findByIdAndUpdate(userId, { // in the User model
      $push: {likedComments: commentId}, // push the commentId into -> User.likedComments = [ ]
      new: true 
    }).lean();
    
  // Inside the Comment -> update array of likedBy with the userId that made the comment
  const comment = await Comment.findByIdAndUpdate(commentId, {
    $push: { likedBy: userId },
    new: true,
  }).lean();
  console.log(comment)

    res.status(200).json(comment).end();
  } catch(err) {
    res.status(400).json(err.message).end();
  }
}


// Delete a comment,
// post - deleteComment: "/comments/:commentId"
async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    if (!isObjectId(commentId)) {
      res.status(400).json("Id not valid").end();
    }
    const comment = await Comment.findByIdAndDelete(commentId).lean();
    console.log(comment);
    res.status(200).json(comment).end();
  } catch (err) {
    res.status(400).json(err.message).end();
  }
}

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    likedComments,
    deleteComment,
};