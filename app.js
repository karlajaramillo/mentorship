const express = require("express");
// add postRouter
// add commentRouter
// add mentorRouter
const filesRouter = require("./modules/files");
const authRouter = require("./modules/auth");
const commentRouter = require("./modules/comment"); // by default takes -> comment/index.js
const postRouter = require("./modules/post")
// add the configuration functions to connect with MongoDb, middlewares and sessionConfig 
const { connectDb, middlewares, sessionConfig } = require("./config"); // from ./config/index.js

async function start() {
  try {
    const { PORT } = process.env; // Server port -> netlify deployment
    // make an instance of express to initialize the server
    const app = express();
    // make the connection with MongoDb
    await connectDb();
    // middlewares
    middlewares(app);
    // authentication
    sessionConfig(app);
    // routes
    authRouter(app); //auth routes
    // mentorRouter(app);
    postRouter(app); // post route
    commentRouter(app); // comment route

    // cloudinary
    filesRouter(app);

    app.listen(PORT, () => console.log(`Server running at: ${PORT}`));
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = start;
