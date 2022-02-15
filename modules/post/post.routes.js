const express = require("express");
const controllers = require("./post.controllers");

const ROUTES = {
  getPosts: "/posts", //get - all posts by post
  getPostsByAuthor: "/posts/:userId/author",
  getPostById: "/posts/:postId", // get - get details by id
  createPost: "/posts", //post - create new comment 
  updatePost: "/posts/:postId", // put - update 
  likedPosts: "/posts/:postId/likes", // post 
  deletePost: "/posts/:postId", // delete
};

function postRouter(app) {
  const router = express.Router();

  router
    .get(ROUTES.getPosts, controllers.getPosts)
    .get(ROUTES.getPostsByAuthor, controllers.getPostsByAuthor)
    .get(ROUTES.getPostById, controllers.getPostById)
    .post(ROUTES.createPost, controllers.createPost)
    .put(ROUTES.updatePost, controllers.updatePost)
    .post(ROUTES.likedPosts, controllers.likedPosts)
    .delete(ROUTES.deletePost, controllers.deletePost);

  app.use("/api", router);
}

module.exports = postRouter;
