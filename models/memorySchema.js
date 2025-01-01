const mongoose=require("mongoose")

const memorySchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true
    },
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        require:true
    },
    title:{
        type:String,
        require:true,
        unique:false
    },
    mood_score:{
        type:Number,
        default:0,
        require:true
    },
    note:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true,
    },
    date:{
        type:Date,
        require:true
    }
},{timestamps:true})

const Memory=mongoose.model("Memory",memorySchema)

module.exports=Memory