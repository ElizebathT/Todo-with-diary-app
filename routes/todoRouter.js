const express=require("express")
const todoController = require("../controllers/todoController")
const userAuthentication = require("../middlewares/userAuthentication")
const todoRouter=express.Router()

todoRouter.get('/add',userAuthentication,todoController.add)
todoRouter.get('/edit',userAuthentication,todoController.edit)
todoRouter.delete('/delete',userAuthentication,todoController.delete)
todoRouter.post('/display',userAuthentication,todoController.display)
todoRouter.post('/completedTasks',userAuthentication,todoController.completedTasks)
todoRouter.post('/reminder',userAuthentication,todoController.reminder)
todoRouter.post('/viewall',userAuthentication,todoController.viewall)

module.exports=todoRouter