const asynHandler=require("express-async-handler")
const Todo = require("../models/todoSchema")
const Tasktype = require("../models/tasktypeSchema")
const nodemailer = require('nodemailer')
require("dotenv").config()

const todoController={
    add:asynHandler(async(req,res)=>{
        const title=req.query.title
        const tasktype=req.query.tasktype
        const description=req.query.description
        const reminder=req.query.reminder
        const currentUser=req.user
        const taskExist=await Todo.findOne({$and:[{title,user_id:currentUser.id}]})
        
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
        const newTask=await Todo.create({
            user_id:req.user.id,
            tasktype_id: newTasktype.id,
            title,
            description,
            reminder
        })
        newTasktype.todo.push(newTask.id)
        await newTasktype.save()
        if(!newTask){
            throw new Error("Creation failed")
        }
        res.send("New todo task added successfully")
    }),
    edit:asynHandler(async(req,res)=>{
        const currentUser=req.user
        const title=req.query.title
        const tasktype=req.query.tasktype
        const description=req.query.description
        const reminder=req.query.reminder
        const status=req.query.status
        const taskExist=await Todo.findOne({$and:[{title,user_id:currentUser.id}]})
        if(!taskExist){
            throw new Error("Task not found")
        }
        // if(status){
        //     const completed=await Todo.deleteOne({_id:taskExist.id})
        //     if(!completed){
        //         throw new Error("Error in completing task")
        //     }    
        //     const checkType=await Tasktype.findOne({todo:taskExist})
        //     if((checkType.todo.length===0)&&(checkType.dailytask.length===0)){
        //     const delTask=await Tasktype.deleteOne({_id:checkType.id})
        //     if(!delTask){
        //         throw new Error("Tasktype deletion failed")
        //     }
        // }          
        //     res.send("Task is complete")
        // }
        if(tasktype)           
            {
                const chngType=await Tasktype.findOne({_id:taskExist.tasktype_id})
                chngType.todo.pull(taskExist.id)
                await chngType.save()
                const currentUser=req.user
                let newTask=await Tasktype.findOne({$and:[{tasktype_name:tasktype,user_id:currentUser.id}]})
                if(!newTask){
                    newTask=await Tasktype.create({
                        tasktype_name:tasktype,
                        user_id:currentUser.id,
                    })
                }
                newTask.todo.push(taskExist.id)
                await newTask.save()
                const addType=await Todo.updateOne({_id:taskExist.id},{tasktype_id:newTask.id})
                
                if((chngType.todo.length===0)&&(chngType.dailytask.length===0)){
                    const delTask=await Tasktype.deleteOne({_id:chngType.id})
                    if(!delTask){
                        throw new Error("Tasktype deletion failed")
                    }
                }  
        }
        
        const updated=await Todo.updateOne({$and:[{title,user_id:req.user.id}]},{$set:{
            title,
            description,
            reminder,
            status
        }})
        
        if(!updated){
            throw new Error("Memory updation failed")
        }
        
        res.send("Memory updated successfully")
    }),
    completedTasks:asynHandler(async(req,res)=>{
        const task=await Todo.find({status:true})
        const completed=task.map(element=>({
            title:element.title,
            description:element.description
        }))
        res.send(completed)
    }),
    viewall:asynHandler(async(req,res)=>{
        const task=await Todo.find({user_id:req.user.id})
        const tasks=task.map(element=>({
            title:element.title,
            description:element.description,
            status:element.status
        }))
        res.send(tasks)
    }),
    delete:asynHandler(async(req,res)=>{
        const{title}=req.body
        const currentUser=req.user
        const taskExist=await Todo.findOne({$and:[{title,user_id:currentUser.id}]})
        if(!taskExist){
            throw new Error("Task not found")
        }
        const chngType=await Tasktype.findOne({_id:taskExist.tasktype_id})
        chngType.todo.pull(taskExist.id)
        await chngType.save()
        if((chngType.todo.length===0)&&(chngType.dailytask.length===0)){
            const delTask=await Tasktype.deleteOne({_id:chngType.id})
            if(!delTask){
                throw new Error("Tasktype deletion failed")
            }
        } 
        const deleteTask=await Todo.deleteOne({_id:taskExist.id})
        if(!deleteTask){
            throw new Error("Task deletion failed")
        }
        res.send("Task deleted successfully")
    }),
    display:asynHandler(async(req,res)=>{
        const {title,tasktype}=req.body
        const currentUser=req.user
        if(title&&tasktype){
            throw new Error("Enter title or tasktype")
        }
        if(title){
            const taskExist=await Todo.findOne({$and:[{title,user_id:currentUser.id}]})
            if(!taskExist){
                throw new Error("Task not found")
            }
            const taskType=await Tasktype.findOne({_id:taskExist.tasktype_id})
            res.send({
                title:taskExist.title,
                tasktype:taskType.tasktype_name,
                description:taskExist.description,
                status:taskExist.status,
                reminder:taskExist.reminder
        })
        }
        if(tasktype){
            const typeExist=await Tasktype.findOne({$and:[{user_id:currentUser.id,tasktype_name:tasktype}]})
            if(!typeExist){
                throw new Error("Tasktype not found")
            }
            const tasks=await Todo.find({tasktype_id:typeExist.id})
            res.send({
                tasks:tasks
            })
        }
    }),
    reminder:asynHandler(async(req,res)=>{
            const {title}=req.body
            const transporter = nodemailer.createTransport({
            service: 'gmail',  
            auth: {
                user: process.env.EMAIL_ID,  
                pass: process.env.EMAIL_PASSWORD,   
            }
            });
            const taskFound=await Todo.findOne({title})
            if(taskFound){

                
                // function sendEmail() {
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
                // }
                
                // const sendAt = taskFound.reminder; 
                // const delay = sendAt.getTime() - Date.now();

                // if (delay > 0) {
                //     setTimeout(sendEmail, delay);
                // } else {
                //     console.log('The time you have specified has already passed.');
                // }
            }

    })
}

module.exports=todoController