const express=require("express")
const connectDB = require("./database/connectDB")
const router = require("./routes")
const errorHandler = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const app=express()

connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(router)
app.use(errorHandler)

app.listen(process.env.PORT,()=>{
    console.log(`Sever is running in ${process.env.PORT}`);
    
})
