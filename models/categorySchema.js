const mongoose=require("mongoose")

const categorySchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true,
    },
    category_name:{
        type:String,
        require:true,
        unique:false
    },
    memories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Memory"
    }]
},{
    timestamps:true
})

const Category=mongoose.model("Category",categorySchema)

module.exports=Category