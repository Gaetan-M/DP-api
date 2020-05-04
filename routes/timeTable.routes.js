const express=require('express');
const router=express.Router();
const timeTable=require('../controllers/timeTable.controller.js');
const authToken=require('../middlewares/auth.js')

router.get('/',timeTable.getCoordo)
router.post('/coordo',timeTable.postCoordo)
router.get('/timeTable',timeTable.getTimeTable)


module.exports=router;