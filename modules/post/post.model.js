const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
    title: String,
    content: String,
    comments: [{ // array of the comments ids for EACH post
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment" 
	}], 
  image: { type: String },
  },
  {
    timestamps: true
  }

);

module.exports = mongoose.model("Post", postSchema);
