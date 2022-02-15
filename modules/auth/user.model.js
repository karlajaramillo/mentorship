const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  role: {
    type:String,
    enum: ['mentor', 'mentee', 'user'],
    // default: 'mentee'
    default: 'user',
  },  
  imageUrl: {
    type: String, 
    default: "https://images.unsplash.com/photo-1514474959185-1472d4c4e0d4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
  },
  title: { //CTO, Student, Senior Cloud and Software Architect 
    type: String,
  },
  bio: { 
    type: String,
  },
  achievement: {
    type: String,
  },
  projects: [
    {
      name: { type: String},
      description: {type: String},
      stack: [],
      imageProject:  {
        type: String,
        default: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=755&q=80',
      },
      stack: {
        type:String,
        enum: ['JavaScript', 'React', 'NodeJS', 'ExpressJS', 'Ruby', 'MongoDB', 'SQL', 'Vue', 'Next', 'Nuxt', 'Nest', 'HTML', 'CSS', 'Python', 'Angular', 'Redux', 'GraphQL', 'Java', 'Jest', 'React Testing Library'],
      }
    }
  ],
  menteeMotivation: {
    type: String,
  },
  mentorService: {
    type:String,
    enum: ['Intro Session', 'CV Review', 'Work Review', 'Regular Calls', 'Chat', 'Study Plan', 'Interview Preparation', 'Tasks', 'Exercises' ],
    default: 'Intro Session'
  },
  organization: {
    type: String,
  },
  country: {
    type: String,
  },
  field: [{
    type:String,
    enum: ['Career', 'Web', 'Frontend', 'Full Stack', 'Backend', 'QA Testing', 'Software Engineering', 'Maching Learning', 'UX', 'Cloud', 'DevOps', 'Native apps', 'Architecture', 'Database', 'Kubernetes', 'Security', 'Aws', 'SaaS' ],
    default: 'Career'
    },
  ],
  linkedin: {
    type: String,
  },
  github: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  mentorBy: { // Mentee mentored by --> Mentor
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Mentor" 
  },
  // Mentee make reviews
  mentorReview: [{ // reviews about the mentor
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review' // reference to the model
  }],
  posts: [{ // array of the posts ids created for each user/author
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // reference to the model
  }],
  comments: [{ // array of the posts ids created for each user/author
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment' // reference to the model
  }],
  likedUsers: [{ // array of id of the profiles the user like
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // reference to the model
  }],
  likedPosts: [{ // array of id of the profiles the user like
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' // reference to the model
  }],
  likedComments: [{ // array of id of the profiles the user like
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment' // reference to the model
  }],
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  bookedMentor: [{ // List of Mentors - that a Mentee booked -> Only Mentee can see this page
    type: mongoose.Schema.Types.ObjectId, // Mentor id that was booked
    ref: "User"
  }],
  bookedMentorBy: [{ // List of Mentees -> Only Mentor can see this page
    type: mongoose.Schema.Types.ObjectId, //Mentees id that booked a Mentor
    ref: "User"
  }]

}, 
{
  timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);
