const express=require("express");
const Users = require("../models/userScehema");

const premiumAuthentication=async(req,res,next)=>{
    const isPremium=await Users.findOne({_id:req.user.id})
    if(isPremium.premium){
        next()
    }
    else{
    throw new Error("You require premium account for this service")
    }
}
module.exports=premiumAuthentication