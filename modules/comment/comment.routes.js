const express = require("express");
const controllers = require("./comment.controllers");

const ROUTES = {
  getComments: "/comments", //get - all comments by post
  getCommentById: "/posts/:postId/comment", // get - get details by id
  createComment: "/posts/:postId/comment", //post - create new comment 
  updateComment: "/posts/:postId/comment", //post - update 
//   deleteComment: "/comments/:commentId", // post
};

function commentRouter(app) {
  const router = express.Router();

  router
    .get(ROUTES.getComments, controllers.getComments)
    .get(ROUTES.getCommentById, controllers.getCommentById)
    .post(ROUTES.createComment, controllers.createComment)
    .put(ROUTES.updateComment, controllers.updateComment)
    // .delete(ROUTES.deleteComment, controllers.deleteTask);

  app.use("/api", router);
}

module.exports = commentRouter;

  
