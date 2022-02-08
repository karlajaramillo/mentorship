const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  // Mentee list
  menteeList:  [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, 
{
  timestamps: true
}
);

module.exports = mongoose.model("Mentor", mentorSchema);
