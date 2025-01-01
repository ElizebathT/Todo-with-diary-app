const mongoose=require("mongoose")

const todoSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true,
    },
    tasktype_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tasktype",
        require:true,
    },
    title:{
        type:String,
        unique:true,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:false
    },
    reminder:{
        type:Date
    }
},{
    timestamps:true
})

const Todo=mongoose.model("Todo",todoSchema)

module.exports=Todo