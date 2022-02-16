const fileUploader = require("./files.config").single("imageUrl");
const express = require("express");
const controllers = require("./files.controllers");

const ROUTES = {
  uploadImage: "/image-upload", // post -> localhost:4000/api/image-upload
};

function filesRouter(app) {
  const router = express.Router();
  // filUploader --> middleware: it's going to create my request .file, where the path of the url of the image 
  router.post(ROUTES.uploadImage, fileUploader, controllers.updloadImage);

  app.use("/api", router);
}

module.exports = filesRouter;
