const express = require("express");
const controllers = require("./comment.controllers");

const ROUTES = {
  getComments: "/comments", //get - all comments by post
  // getCommentById: "/posts/:postId/comment", // get - get details by id
  getCommentById: "/comments/:commentId", // get - get a comment
  createComment: "/posts/:postId/comment", //post - create new comment 
  updateComment: "/comments/:commentId", // put - update a comment
  likedComments: "/comments/:commentId/likes", //post - like a comment
  deleteComment: "/comments/:commentId", // delete a comment
};

function commentRouter(app) {
  const router = express.Router();

  router
    .get(ROUTES.getComments, controllers.getComments)
    .get(ROUTES.getCommentById, controllers.getCommentById)
    .post(ROUTES.createComment, controllers.createComment)
    .put(ROUTES.updateComment, controllers.updateComment)
    .post(ROUTES.likedComments, controllers.likedComments)
    .delete(ROUTES.deleteComment, controllers.deleteComment);

  app.use("/api", router);
}

module.exports = commentRouter;

  
