const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" 
  },
    title: String,
    content: String,
  },
  {
    timestamps: true
  }

);

module.exports = mongoose.model("Review", reviewSchema);