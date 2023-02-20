const express = require('express');
const { PostModel } = require('../model/PostModel');
const jwt = require("jsonwebtoken");
const { authenticate } = require('../middleware/authenticate.middleware');




const postRouter=express.Router()

postRouter.post('/create',authenticate,async(req,res)=>{
    const payload=req.body
    try {
        const post = new PostModel(payload)
        await post.save()
        res.send({message:"Post Created Successfully"})
    } catch (error) {
        res.send({error: error.message})
    }
})

postRouter.get('/',authenticate,async(req,res)=>{
    const user=req.body.user
    if(req.query.device){
        const posts=await PostModel.find({$and:[{user},{device:req.query.device}]})
        res.send(posts)
    }else{
        const posts = await PostModel.find({ user });
        res.send(posts);
    }
    
})

postRouter.get("/top", authenticate, async (req, res) => {
  const user = req.body.user;
  const posts = await PostModel.find({ user }).sort({no_of_comments:-1}).limit(1);
  res.send(posts);
});

postRouter.delete("/delete/:id",authenticate,async(req,res)=>{
    const postID=req.params.id;
    await PostModel.findByIdAndDelete({_id:postID})
    res.send({message:`post with id ${postID} has been deleted`})
})

postRouter.patch('/update/:id',authenticate,async(req,res)=>{
    const postID=req.params.id
    await PostModel.findByIdAndUpdate({_id:postID},{$set:req.body})
    res.send({message:`post with id ${postID} has been updated`})
})

module.exports ={postRouter}




// /posts ==> This will show the posts of logged in users.
// /posts/top ==> This will show the post details that has maximum number of comments for the user who has logged in.
// /posts/update ==> The logged in user can update his/her posts.
// /posts/delete ==> The logged in user can delete his/her posts.