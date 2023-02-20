const express = require('express');
const { UserModel } = require('../model/UserModel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userRouter=express.Router()

userRouter.post('/register',async(req,res)=>{
    try {
        const {name,email,password,gender,age,city}=req.body
        const userCheck=await UserModel.find({email})
        if(userCheck.length > 0){
            res.send({message:"User already exists, please login"});
        }else{
            const hashedPassword=await bcrypt.hash(password,5)
            const user=new UserModel({name,email,password:hashedPassword,gender,age,city})
            await user.save()
            res.status(201).json({message:"User Registered successfully"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

userRouter.post('/login',async(req,res)=>{
    const {email, password} = req.body
    try {
        const user=await UserModel.find({email})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id},"shhhhh")
                    res.send({message:"Logged in successfully",token:token})
                }else{
                    res.send({message:"Wrong Credentials"})
                }
            })
        }else{
            res.send({ message: "Wrong Credentials" });
        }
    } catch (error) {
        res.send({message:"unable to login",error:error.message})
    }
})

module.exports ={userRouter}