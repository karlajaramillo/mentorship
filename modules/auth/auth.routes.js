const express = require("express");
const controllers = require("./auth.controllers");

const ROUTES = {
  signup: "/signup",
  login: "/login",
  logout: "/logout",
  isLoggedIn: "/login",
  role: "/role",
  getUsers: "/users",
  getUserById: "/users/:userId",
  updateUser: "/users/:userId/profile",
  likedUsers: "/users/:userId/likes",
  bookedMentor: "/users/:userId/mentor" // this is Mentor userId
};

function authRouter(app) {
  const router = express.Router();

  router
    .post(ROUTES.signup, controllers.signup)
    .post(ROUTES.login, controllers.login)
    .post(ROUTES.logout, controllers.logout)
    .get(ROUTES.isLoggedIn, controllers.getLoggedInUser)
    .put(ROUTES.updateUser, controllers.updateUser)
    .get(ROUTES.role, controllers.getRole)
    .get(ROUTES.getUsers, controllers.getUsers)
    .get(ROUTES.getUserById, controllers.getUserById)
    .post(ROUTES.likedUsers, controllers.likedUsers)
    .post(ROUTES.bookedMentor, controllers.bookedMentor)


  app.use("/api", router);
}

module.exports = authRouter;
