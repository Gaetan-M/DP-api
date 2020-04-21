const express=require('express');
const router=express.Router();
const attributionCour=require('../controllers/attributionCour.controller.js');
const authToken=require('../middlewares/auth.js')

router.get('/classes',attributionCour.getClasses)
router.get('/cours',attributionCour.getCours)
router.get('/module',attributionCour.getModules)
router.get('/personnel',attributionCour.getPersonnel)
router.get('/faculty',attributionCour.getFaculty)
router.post('/',attributionCour.newEnseignant);
router.get('/find',attributionCour.findenseignants)
// router.delete('/',attributionCour.deleteClasses)

module.exports=router;