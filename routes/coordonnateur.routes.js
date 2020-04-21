const express=require('express');
const router=express.Router();
const coordonnateur=require('../controllers/Coordonnateur.controller.js');
const authToken=require('../middlewares/auth.js')

router.post('/',coordonnateur.newCordonnateur);
router.get('/find',coordonnateur.findCordonnateur)
router.get('/',coordonnateur.getfaculty)

module.exports=router;