const express=require("express")
const userController = require("../controllers/userController")
const userAuthentication = require("../middlewares/userAuthentication")
const premiumAuthentication = require("../middlewares/premiumAuthentication")
const userRouter=express.Router()

userRouter.get('/register',userController.register)
userRouter.get('/login',userController.login)
userRouter.get('/logout',userController.logout)
userRouter.get('/leaderboard',userAuthentication,premiumAuthentication,userController.leaderboard)
module.exports=userRouter