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
  imageUrl: {
    type: String, 
    default: "https://unsplash.com/photos/8OVDzMGB_kw",
  },
  },
  {
    timestamps: true
  }

);

module.exports = mongoose.model("Post", postSchema);
