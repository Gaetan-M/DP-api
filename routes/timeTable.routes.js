const express=require('express');
const router=express.Router();
const timeTable=require('../controllers/timeTable.controller.js');
const authToken=require('../middlewares/auth.js')

router.get('/',timeTable.getTimeTable)
router.post('/',timeTable.postCoordo)


module.exports=router;