const express=require("express")
const userAuthentication = require("../middlewares/userAuthentication")
const paypalController = require("../controllers/paypalController")
const paypalMiddleware = require("../middlewares/paypalMiddleware")
const paypalRouter=express.Router()

paypalRouter.post('/create_payment',userAuthentication,paypalController.createPayment)
// paypalRouter.post('/create_payment',paypalMiddleware)
// paypalRouter.post('/capture_payment',userAuthentication,paypalController.capturePayment)
paypalRouter.post('/payment_sucess',userAuthentication,paypalController.payment_sucess)

module.exports=paypalRouter


