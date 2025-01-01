const mongoose=require("mongoose")

const dailytaskSchema=new mongoose.Schema({
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
        require:true
    },
    description:{
        type:String,
        require:true
    },
    task_point:{
        type:Number,
        default:0
    },
    reminder:{
        type:Date,
        require:true
    },
    completed:[{
        start_time:{
            type:Date
        },
        completion_time:{
            type:Date
        }
    }]    
},{
    timestamps:true
})

const Dailytask=mongoose.model("Dailytask",dailytaskSchema)

module.exports=Dailytask