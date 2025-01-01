const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true,
        minLength:[5,"Minimum 5 characters required"],
        maxLength:[15,"Maximum 15 characters allowed"]
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        minLength:[5,"Minimum 5 characters required"]
    },
    premium:{
        type:Boolean,
        default:false,
        require:true
    },
    streaks:{
        type:Number,
        default:1
    }
},{
    timestamps:true
})

const Users=mongoose.model("User",userSchema)

module.exports=Users