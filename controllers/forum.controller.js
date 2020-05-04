const Forum=require('../models/forum.models.js')
const  Personnel=require('../models/personnel.model.js')
const  Cours=require('../models/cours.model.js')

var DATA={};

module.exports.getData= async (req,res,next)=>{
	await Personnel.find()
	.then(data=>DATA.personnel=data)
	.catch(error=>{console.log(error),res.status(500).json({error:'error server'})})
    
   await Cours.find()
	.then(data=>DATA.cours=data)
	.catch(error=>{console.log(error),res.status(500).json({error:'error server'})})
  
   await Forum.find()
	.then(data=>DATA.Forum=data)
	.catch(error=>{console.log(error),res.status(500).json({error:'error server'})})
    
    res.status(200).json(DATA) 
}