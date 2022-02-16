const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
  title:{type: String, required: true },
  content: {type: String, required: true },
  comments: [{ // array of the comments ids for EACH post
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "Comment" 
	}], 
  imageUrl: {
    type: String, 
    default: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  //
  },
  {
    timestamps: true
  }

);

module.exports = mongoose.model("Post", postSchema);
