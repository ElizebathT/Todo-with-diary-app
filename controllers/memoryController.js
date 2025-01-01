const asyncHandler=require("express-async-handler")
const Memory = require("../models/memorySchema")
const Category = require("../models/categorySchema")
const memoryController={
    addMemory:asyncHandler(async(req,res)=>{
        const title=req.query.title
        const category=req.query.category
        const mood_score=req.query.mood_score
        const note=req.query.note
        const location=req.query.location
        const date=req.query.date
        const currentUser=req.user
        let titleExist=await Memory.findOne({$and:[{title,user_id:currentUser.id}]})
        if(titleExist){
            throw new Error("Memory already exist")
        }
        let newCategory=await Category.findOne({$and:[{category_name:category,user_id:currentUser.id}]})
        if(!newCategory){
            newCategory=await Category.create({
                category_name:category,
                user_id:currentUser.id,
            })
        }
        const newMemory=await Memory.create({
            user_id:currentUser.id,
            category_id: newCategory.id,
            mood_score,
            title,
            note,
            location,
            date
        })
        newCategory.memories.push(newMemory.id)
        await newCategory.save()
        res.send("Memory added successfully")
    }),
    editMemory:asyncHandler(async(req,res)=>{
        const title=req.query.title
        const category=req.query.category
        const mood_score=req.query.mood_score
        const note=req.query.note
        const location=req.query.location
        const date=req.query.date
        const memory=await Memory.findOne({$and:[{title:title,user_id:req.user.id}]})
        if(!memory){
            throw new Error("Memory not found")
        } 
        if(category)           
            {
                const chngCategory=await Category.findOne({_id:memory.category_id})
                chngCategory.memories.pull(memory.id)
                await chngCategory.save()
                const currentUser=req.user
                let newCategory=await Category.findOne({$and:[{category_name:category,user_id:currentUser.id}]})
                if(!newCategory){
                    newCategory=await Category.create({
                        category_name:category,
                        user_id:currentUser.id,
                    })
                }
                newCategory.memories.push(memory.id)
                const addCat=await Memory.updateOne({_id:memory.id},{category_id:newCategory.id})
                await newCategory.save()
                if(chngCategory.memories.length===0){
                    const delCat=await Category.deleteOne({_id:chngCategory.id})
                    if(!delCat){
                        throw new Error("Category deletion failed")
                    }
                }  
        }
        const updated=await Memory.updateOne({$and:[{title,user_id:req.user.id}]},{$set:{
            mood_score,
            note,
            location,
            date
        }})
        
        if(!updated){
            throw new Error("Memory updation failed")
        }
        
        res.send("Memory updated successfully")
    }),
    deleteMemory:asyncHandler(async(req,res)=>{
        const title=req.query.title
        const findMemory=await Memory.findOne({$and:[{title,user_id:req.user.id}]})
        if(!findMemory){
            throw new Error("Memory not found")
        }
        const deleteCategory=await Category.findOne({_id:findMemory.category_id})
        deleteCategory.memories.pull(findMemory.id)
        await deleteCategory.save()
        if(deleteCategory.memories.length===0){
            const delCat=await Category.deleteOne({_id:findMemory.category_id})
            if(!delCat){
                throw new Error("Category deletion failed")
            }
        }        
        const memory=await Memory.deleteOne({$and:[{title,user_id:req.user.id}]})
        if(!memory){
            throw new Error("Deletion failed")
        }        
        res.send("Memory deleted sucessfully")
    }),
    viewMemory:asyncHandler(async(req,res)=>{
        const title=req.query['title']
        const category=req.query.category
        console.log(title);
        
        if(title&&category){
            throw new Error("Enter title or category")
        }
        if(title){
            const memory=await Memory.findOne({title})
            if(!memory){
                throw new Error("Memory not found")
            }
            const cat=await Category.findOne({_id:memory.category_id})
            res.send({
                title:memory.title,
                category:cat.category_name,
                mood_score:memory.mood_score,
                note:memory.note,
                location:memory.location,
                date:memory.date
            })
        }
        if(category){
            const categoryName=await Category.findOne({$and:[{category_name:category,user_id:req.user.id}]})
            const memories=await Memory.find({category_id:categoryName.id})
            const categoryMemory= memories.map(memories => ({
                title:memories.title,
                note:memories.note,
                mood_score:memories.mood_score
            }));
            res.send(categoryMemory)
        }
    }),
    findMoodscore:asyncHandler(async(req,res)=>{
        const latestMemories = await Memory.find().sort({ date: -1 }).limit(7);
        
        const memoryLength=latestMemories.length
        let score=0,i=0
        while (i<memoryLength) {
            score+=latestMemories[i].mood_score           
            i++            
        } 
        score/=memoryLength        
        res.send({mood_score:score});
        
    }),
    viewall:asyncHandler(async(req,res)=>{
        const memory=await Memory.find({user_id:req.user.id})
        const memories=memory.map(element=>({
            title:element.title,
            note:element.note,
            date:element.date,
            mood:element.mood_score
        }))
        res.send(memories)
    })
}

module.exports=memoryController