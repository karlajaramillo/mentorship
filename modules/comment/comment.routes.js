const express = require("express");
const controllers = require("./comment.controllers");

const ROUTES = {
  getComments: "/comments", //get - all comments by post
  getCommentById: "/comments/:commentId", // get - get details by id
  createComment: "/comments", //post - create new comment 
  updateComment: "/comments/:commentId", //post - update 
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

  
