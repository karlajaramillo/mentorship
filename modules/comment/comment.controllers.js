const mongoose = require("mongoose");
const Comment = require("./comment.model");
const Post = require("../comment/comment.model");
const User = require("../auth/user.model");


function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Get all comments by userId 
// get -> getComments - /comments",
async function getComments(req, res) {
  try {
    const userId = req.session?.user?._id;
    console.log(req.session.user);
    //user: { email: 'k300@mail.com', _id: '62005ce44d0e0fd37c6e7711' }
    const comments = await Comment.find().lean(); 
    //const comments = await Comment.find({ author: userId }).lean(); 
    console.log(comments);
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
// post -> createComment: "/comments"
// the form: content
async function createComment(req, res) {
  try {
    const {content, postId} = req.body;
    const userId = req.session?.user?._id;
    const user = await User.findById(userId);

    const comment = await Comment.create({ content, userId });
    const postWithComment = await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id },
      });
    res.status(200).json(postWithComment).end();
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


// //Delete a comment,
// // post - deleteComment: "/comments/:commentId"
// async function deleteComment(req, res) {
//   try {
//     const { commentId } = req.params;
//     if (!isObjectId(commentId)) {
//       res.status(400).json("Id not valid").end();
//     }
//     const comment = await Comment.findByIdAndDelete(commentId).lean();
//     console.log(comment);
//     res.status(200).json(comment).end();
//   } catch (err) {
//     res.status(400).json(err.message).end();
//   }
// }

module.exports = {
    getComments,
    getCommentById,
    createComment,
    updateComment,
};