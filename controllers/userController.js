const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const asyncHandler=require("express-async-handler")
const Users = require("../models/userScehema")
const userController={
    register:asyncHandler(async(req,res)=>{
        const {username,email,password}=req.body
        const userExits=await Users.findOne({username})
        if(userExits){
            throw new Error("User already exists")
        }
        const hashed_password=await bcrypt.hash(password,10)
        const userCreated=await Users.create({
            username,
            email,
            password:hashed_password
        })
        if(!userCreated){
            throw new Error("User creation failed")
        }
        const payload={
            email:userCreated.email,
            id:userCreated.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{
            maxAge:2*24*60*60*1000,
            http:true,
            sameSite:"none",
            secure:false
        })
        res.send("User created successfully")
    }),
    login:asyncHandler(async(req,res)=>{
        const {email,password}=req.body
        const userExist=await Users.findOne({email})
        if(!userExist){
            throw new Error("User not found")
        }
        const passwordMatch= bcrypt.compare(userExist.password,password)
        if(!passwordMatch){
            throw new Error("Passwords not matching")
        }
        const payload={
            email:userExist.email,
            id:userExist.id
        }
        const token=jwt.sign(payload,process.env.JWT_SECRET_KEY)
        res.cookie("token",token,{
            maxAge:2*24*60*60*1000,
            sameSite:"none",
            http:true,
            secure:false
        })
        if(userExist.premium===true){
        const streaks=await Users.updateOne({_id:userExist.id},{$inc:{streaks:1}})
        }
        res.send("Login successful")
    }),
    logout:asyncHandler(async(req,res)=>{
        res.clearCookie("token")
        res.send("User logged out")
    }),
    leaderboard:asyncHandler(async(req,res)=>{
        const leaderboard = await Users.find().sort({ streaks: -1 }).limit(5);
        const leaderboardData = leaderboard.map(user => ({
            username: user.username,
            streaks: user.streaks,
        }));
        
        res.send(leaderboardData);
    })
}
module.exports=userController