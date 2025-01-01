const express=require("express")
const userRouter = require("./userRouter")
const memoryRouter = require("./memoryRouter")
const todoRouter = require("./todoRouter")
const dailytaskRouter = require("./dailytaskRouter")
const paypalRouter = require("./paypalRouter")
const router=express()

router.use('/user',userRouter)
router.use('/memory',memoryRouter)
router.use('/todo',todoRouter)
router.use('/dailytask',dailytaskRouter)
router.use('/paypal',paypalRouter)
 
module.exports=router
