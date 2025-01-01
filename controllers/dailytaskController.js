const express=require("express")
const asyncHandler=require("express-async-handler")
const Dailytask = require("../models/dailytaskSchema")
const Tasktype = require("../models/tasktypeSchema")
const nodemailer = require('nodemailer')
const dailytaskController={
    add:asyncHandler(async(req,res)=>{
        const title=req.query.title
        const tasktype=req.query.tasktype
        const description=req.query.description
        const reminder=req.query.reminder
        const currentUser=req.user
        const taskExist=await Dailytask.findOne({$and:[{user_id:currentUser.id,title}]})
        if(taskExist){
            throw new Error("Task already exist")
        }
        let newTasktype=await Tasktype.findOne({$and:[{tasktype_name:tasktype,user_id:currentUser.id}]})
        if(!newTasktype){
            newTasktype=await Tasktype.create({
                tasktype_name:tasktype,
                user_id:currentUser.id,
            })
        }
        const newTask=await Dailytask.create({
            user_id:currentUser.id,
            tasktype_id: newTasktype.id,
            title,
            description,
            reminder
        })
        newTasktype.dailytask.push(newTask.id)
        await newTasktype.save()
        if(!newTask){
            throw new Error("Creation failed")
        }
        res.send("New dailytask added successfully")
    }),
    delete:asyncHandler(async(req,res)=>{
        const title=req.params.title
        const currentUser=req.user
        const taskExist=await Dailytask.findOne({$and:[{title,user_id:currentUser.id}]})
        if(!taskExist){
            throw new Error("Task not found")
        }
        const chngType=await Tasktype.findOne({_id:taskExist.tasktype_id})
        chngType.dailytask.pull(taskExist.id)
        await chngType.save()
        if((chngType.todo.length===0)&&(chngType.dailytask.length===0)){
            const delTask=await Tasktype.deleteOne({_id:chngType.id})
            if(!delTask){
                throw new Error("Tasktype deletion failed")
            }
        } 
        const deleteTask=await Dailytask.deleteOne({_id:taskExist.id})
        if(!deleteTask){
            throw new Error("Task deletion failed")
        }
        res.send("Task deleted successfully")
    }),
    display:asyncHandler(async(req,res)=>{
        const {title,tasktype}=req.body
        const currentUser=req.user
        if(title&&tasktype){
            throw new Error("Enter title or tasktype")
        }
        if(title){
            const taskExist=await Dailytask.findOne({$and:[{title,user_id:currentUser.id}]})
            if(!taskExist){
                throw new Error("Task not found")
            }
            const taskType=await Tasktype.findOne({_id:taskExist.tasktype_id})
            res.send({
                title:taskExist.title,
                tasktype:taskType.tasktype_name,
                description:taskExist.description,
                status:taskExist.status,
                task_point:taskExist.task_point,
                reminder:taskExist.reminder
        })
        }
        if(tasktype){
            const typeExist=await Tasktype.findOne({$and:[{user_id:currentUser.id,tasktype_name:tasktype}]})
            if(!typeExist){
                throw new Error("Tasktype not found")
            }
            const tasks=await Dailytask.find({tasktype_id:typeExist.id})
            res.send(tasks)
        }
    }),
    edit:asyncHandler(async(req,res)=>{
        const currentUser=req.user
        const title=req.query.title
        const tasktype=req.query.tasktype
        const description=req.query.description
        const reminder=req.query.reminder
        const taskExist=await Dailytask.findOne({$and:[{title,user_id:currentUser.id}]})
        if(!taskExist){
            throw new Error("Task not found")
        }
        if(tasktype)           
            {
                const chngType=await Tasktype.findOne({_id:taskExist.tasktype_id})
                chngType.dailytask.pull(taskExist.id)
                await chngType.save()
                const currentUser=req.user
                let newTask=await Tasktype.findOne({$and:[{tasktype_name:tasktype,user_id:currentUser.id}]})
                if(!newTask){
                    newTask=await Tasktype.create({
                        tasktype_name:tasktype,
                        user_id:currentUser.id,
                    })
                }
                newTask.dailytask.push(taskExist.id)
                await newTask.save()
                const addType=await Dailytask.updateOne({_id:taskExist.id},{tasktype_id:newTask.id})
                
                if((chngType.todo.length===0)&&(chngType.dailytask.length===0)){
                    const delTask=await Tasktype.deleteOne({_id:chngType.id})
                    if(!delTask){
                        throw new Error("Tasktype deletion failed")
                    }
                }  
        }
        const updated=await Dailytask.updateOne({$and:[{title,user_id:req.user.id}]},{$set:{
            title,
            description,
            reminder,
        }})
        
        if(!updated){
            throw new Error("Memory updation failed")
        }
        
        res.send("Memory updated successfully")
    }),
    mark_complete:asyncHandler(async(req,res)=>{
        const title =req.query.title
        const start_time=req.query.start_time
        const completion_time=req.query.completion_time
        const currentUser=req.user
        const taskExist=await Dailytask.findOne({$and:[{title,user_id:currentUser.id}]})
        if(!taskExist){
            throw new Error("Task not found")
        }
        const pointAdded=await Dailytask.updateOne({_id:taskExist.id},{$inc:{task_point:1}})
        const newRecord={
            start_time,
            completion_time
        }
        taskExist.completed.push(newRecord)
        await taskExist.save()
        res.send("Task completed")
    }),
    viewall:asyncHandler(async(req,res)=>{
        const task=await Dailytask.find({user_id:req.user.id})
        const tasks=task.map(element=>({
            title:element.title,
            description:element.description,
            task_point:element.task_point
        }))
        res.send(tasks)
    }),
    reminder:asyncHandler(async(req,res)=>{
            const {title}=req.body
            const transporter = nodemailer.createTransport({
            service: 'gmail',  
            auth: {
                user: process.env.EMAIL_ID,  
                pass: process.env.EMAIL_PASSWORD,   
            }
            });
            const taskFound=await Dailytask.findOne({title})
            if(taskFound){
                    const mailOptions = {
                        from: process.env.EMAIL_ID, 
                        to: req.user.email, 
                        subject: 'Reminder for your task',  
                        text: 'Hello, this is a email sent to remind you about your task that is pending. Task title: '+taskFound.title+', Task description: '+taskFound.description,  
                        };
                    transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log('Error occurred: ' + error);
                            }
                            res.send('Notification sent successfully ');
                            });
            }

    })
}
module.exports=dailytaskController