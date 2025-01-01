const mongoose=require("mongoose")

const tasktypeSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true,
    },
    tasktype_name:{
        type:String,
        require:true
    },
    dailytask:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dailytask"
    }],
    todo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
    }]
},{
    timestamps:true
})

const Tasktype=mongoose.model("Tasktype",tasktypeSchema)

module.exports=Tasktype