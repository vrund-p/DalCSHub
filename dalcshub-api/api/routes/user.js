// Authors: Shiwen(Lareina), Vrund Patel, Khaled Al-Mahbashi

const express = require("express");
const User = require("../models/user");
const Course = require("../models/course");
const Post = require("../models/post");
const router = express.Router();

// Lareina: PUT call to follow course
router.put("/follow", async (req, res) => {
  const body = req.body;
  const { userId, courseId } = body;

  try {
    if (!userId || !courseId) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect Request!" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course || !user) {
      return res
        .status(404)
        .json({ success: false, message: "User or Course not found" });
    }

    // Check if the user is already following the course
    if (user.followedCourses.includes(courseId)) {
      return res
        .status(409)
        .json({ success: false, message: "User is already following the course" });
    }

    // Update the user's followedCourses array with the course ID
    user.followedCourses.push(courseId);
    await user.save();

    res.json({ success: true, message: "Course followed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

// Lareina: PUT call to unfollow course
router.put("/unfollow", async (req, res) => {
  const body = req.body;
  const { userId, courseId } = body;

  try {
    if (!userId || !courseId) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect Request!" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course || !user) {
      return res
        .status(404)
        .json({ success: false, message: "User or Course not found" });
    }

    // Check if the user is already following the course
    if (!user.followedCourses.includes(courseId)) {
      return res
        .status(409)
        .json({ success: false, message: "User is not following the course" });
    }

    // Remove the courseId from the user's followedCourses array 
    user.followedCourses.pull(courseId);
    await user.save();

    res.json({ success: true, message: "Course unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
});

// Khaled: add saved post
router.put('/savePost', async (req, res) =>{
  
  const body = req.body;
  const { userId, postId } = body;

  try {
    if (!userId || !postId) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect Request!" });
    }

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!post || !user) {
      return res
        .status(404)
        .json({ success: false, message: "User or Post not found" });
    }
    
    // Check if the user has already added the post
    if (user.savedPosts.includes(postId)) {
      return res
        .status(409)
        .json({ success: false, message: "User has already saved the post" });
    }

    // Update the user's savedPosts array with the post ID
    user.savedPosts.push(postId);
    await user.save();

    res.json({ success: true, message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
})

// Khaled: remove saved post
router.put('/unsavePost', async (req, res) =>{
  
  const body = req.body;
  const { userId, postId } = body;

  try {
    if (!userId || !postId) {
      return res
        .status(404)
        .json({ success: false, message: "Incorrect Request!" });
    }

    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    const savedPosts = user.savedPosts;


    if (!post || !user) {
      return res
        .status(404)
        .json({ success: false, message: "User or Post not found" });
    }
    
    // Check if the user has not saved the post
    if (!savedPosts.includes(postId)) {
      return res
        .status(409)
        .json({ success: false, message: "Post is not saved" });
    }

    const index = savedPosts.indexOf(postId);
    if (index !== -1) {
      savedPosts.splice(index, 1);
    } 
    await user.save();  

    res.json({ success: true, message: "Post unsaved successfully", data: savedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
})

// Khaled: Get saved posts
router.get('/savedPosts/:id', async (req, res) =>{
  const userId = req.params.id;

  try {
      if(!userId) {
          return res.status(404).json({success: false, data: "Incorrect Request!"});
      }
  } catch(err) {
      return res.status(500).json({ success: false, message: "Internal server error!"});
  }

  try { 
    User.findById(userId)
      .then((user) => res.status(200).json({ savedPosts: user.savedPosts }))
      .catch((err) => res.status(500).json({ success: false, error: 'Error fetching saved posts' }));
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to user by Id" });
  }
})
 
//Author: Vrund Patel
//adding user's details to the database (user's registration)
router.post('/x', async(req, res) => {

    const {firstName, lastName, type, email, password} = req.body

    if( !firstName || !lastName || !type || !email || !password ){
        return res.status(422).json({ success: false, message: "At least one of field is missing" });
    }

    try {
        
        const exist = await User.findOne({ email: email });

        if(exist){
            return res.status(422).json({ success: false, message: "Email already exist" })
        }

        const user = new User({firstName, lastName, type, email, password});
        const userRegister = await user.save()

        if(userRegister){
            res.status(200).json({ success: true, message: "User registerd successfully :)"})
        }
        else{
            res.status(500).json({ success: false, message: "Registration Failed :(" })
        }
    } catch (error) {
        console.log(` error ${error}`)
    }
});

//Author: Vrund Patel
//Authenticates the user crendentials
router.post('/signin', async(req, res) => {
    
    try {
        
        const {email, password} = req.body

        if( !email || !password){
            return res.status(400).json({success: false, message: "At least one of the field is empty :("});
        }

        const userLogin = await User.findOne( {email: email} )

        if(userLogin){

            if(password === userLogin.password){
                return res.status(200).json({success: true, message: "Signin Successful :)", data: userLogin});
            }
            else{
                return res.status(400).json({success: false, message: "Invalid Credentails :( "});
            }
        }
        else{
            return res.status(400).json({success: false, message: "Email not found :( "});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
})

//Lareina: Get user detail by id
router.get('/:id', async(req, res) => {
  const userId = req.params.id;
    try {
        if(!userId) {
            return res.status(404).json({success: false, data: "Incorrect Request!"});
        }
    } catch(err) {
        return res.status(500).json({message: "Internal server error!"});
    }

    try {
      User.findById(userId)
        .then((user) => res.status(200).json({ success: true, data: user}))
        .catch((err) => res.status(500).json({ success: false, error: 'Error fetching user by Id' }));
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to user by Id" });
    }
})

module.exports = router;
