# CareerUp - Server

# Description
CareerUp is a web application that provides mentorship in Tech, in CareerUp Mentees and Mentors connect to grow in their careers.
As a Mentee you can discover Mentors that are a perfect fit for you, grow with online mentoring guidance and take your career to the next level!
Mentors can get be recognized and offer their online services to provide advice and support to help mentees achieve their perosonal and professional goals.

# Server Install
```
npm install
```

# Server Usage
```
npm run dev
```

# Backend Endpoints
 
|	Method	|	Path	|	Description	|
|	-	|	-	|	-	|	
|	GET	|	/api/auth/isloggedin	|	Check with the session if the user is allready logged |
|	GET	|	api/login	|	Check with the session if the user is allready logged in |
|	POST	|	/api/signup	|	Create and save a user in the database	|
|	POST	|	/api/login	|	Create and save the mentor/mentee in the database	|
|	POST	|	/api/logout		|	Destroys the session of the mentor/mentee |
|		|		|	|
|	GET	| /api/users	|	Retrieve all the mentors/mentees from DB	|
|	GET	|	/api/users/:userId	|	Retrieve one mentor/mentee data	|
|	Put	|	/api/users/:userId/profile 	|	Update the mentor/mentee profile	|
|	GET	|	/api/users/:userId/likes	|	Make a like another mentor/mentee profile	|
|	PUT	|	/api/users/:userId/mentor	|	Being a mentee, booked a mentor |
|		|		|	|
|	GET	| /api/posts	|	Retrieve all the posts  from the DB	|
|	GET	|	/api/posts/:userId/author	|	Retrieve one post by author	|
|	GET	|	/api/posts/:postId	|	Get details of a specific post	|
|	POST	|	/api/posts	|	Create a post	|
|	PUT	|	/api/posts/:postId	|	Update a specific post	|
|	POST	|	api/posts/:postId/likes	|	Like a specific post	|
|	DELETE	|	api/posts/:postId	|	Delete a specific post |
|		|		|	|
|	GET	| /api/comments	|	Retrieve all the comments  from the DB	|
|	GET	|	/api/comments/:commentId	|	Retrieve a specific comment	|
|	POST	|	/api/posts/:postId/comment	|	Create a comment of a specific post	|
|	PUT	|	/api/comments/:commentId	|	Update a specific comment	|
|	POST	|	api/comments/:commentId/likes	|	Like a specific comment	|
|	DELETE	|	api/comments/:commentId	|	Delete a specific comment |

# Models

User model
 
```
email: String
password: String
imageUrl: String / Default
name: String 
role: enum ["mentor", "mentee", "user"]
title: String 
organization: String 
bio: String 
achievement: String 
menteeMotivation: String 
mentorMotivation: String 
field: enum ['Career', 'Web', 'Frontend', 'Full Stack', 'Backend', 'QA Testing', 'Software Engineering', 'Maching Learning', 'UX', 'Cloud', 'DevOps', 'Native apps', 'Architecture', 'Database', 'Kuberneter', 'Security', 'Aws', 'SaaS' ],
bookedMentor: mongoose.Schema.Types.ObjectId, <User>
bookedMentorBy: mongoose.Schema.Types.ObjectId, <User>
posts: Array
comments: Array
```

Post model

```
author: ObjectId<User>
title: String
comments: ObjectId<Comments>
likedBy: ObjectId<User>
image: String / Default 
``` 

Comments model

```
autor: ObjectId<User>
content: String
comments: String
likedBy: ObjectId<User>
``` 

# Technologies
<ul >
<li style= "display:flex" > <img src="https://user-images.githubusercontent.com/91207576/148804550-8d018eb4-b161-4f2e-a413-06745e84b7d5.png" width="30" />  <span>React</span>
</li> 
<li> <img src="https://user-images.githubusercontent.com/91207576/148806744-de70aa27-d3bc-4356-88ee-41367a594c04.png" width="40" /> 
Node.Js  </li> 
<li> <img src="https://user-images.githubusercontent.com/91207576/148806927-3a3fc9d0-4c4a-4aa9-9332-d67d7aa56e10.png" width="40" />   MongoDB  </li>  
<li><img src="https://user-images.githubusercontent.com/91207576/148807194-66d29acb-5b14-45fb-8452-a8085b0bab90.png" width="40"/>
 Express  </li> 
</ul>
