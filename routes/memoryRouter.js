const express=require("express")
const memoryController = require("../controllers/memoryController")
const userAuthentication = require("../middlewares/userAuthentication")

const memoryRouter=express.Router()

memoryRouter.get('/add',userAuthentication,memoryController.addMemory)
memoryRouter.get('/edit',userAuthentication,memoryController.editMemory)
memoryRouter.post('/view',userAuthentication,memoryController.viewMemory)
memoryRouter.delete('/delete',userAuthentication,memoryController.deleteMemory)
memoryRouter.post('/viewall',userAuthentication,memoryController.viewall)
memoryRouter.get('/moodscore',userAuthentication,memoryController.findMoodscore)

module.exports=memoryRouter