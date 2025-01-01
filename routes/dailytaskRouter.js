const express=require("express")
const userAuthentication = require("../middlewares/userAuthentication")
const dailytaskController = require("../controllers/dailytaskController")
const premiumAuthentication = require("../middlewares/premiumAuthentication")
const dailytaskRouter=express.Router()

dailytaskRouter.get('/add',userAuthentication,dailytaskController.add)
dailytaskRouter.delete('/delete/:title',userAuthentication,dailytaskController.delete)
dailytaskRouter.post('/display',userAuthentication,dailytaskController.display)
dailytaskRouter.get('/edit',userAuthentication,dailytaskController.edit)
dailytaskRouter.post('/reminder',userAuthentication,dailytaskController.reminder)
dailytaskRouter.get('/taskcompleted',userAuthentication,premiumAuthentication,dailytaskController.mark_complete)
dailytaskRouter.post('/viewall',userAuthentication,dailytaskController.viewall)


module.exports=dailytaskRouter