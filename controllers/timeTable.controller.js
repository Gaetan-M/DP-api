const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const  Classe=require('../models/classe.model.js')
const  Coordonateur=require('../models/coordonnateur.model.js')
const  Faculty=require('../models/faculty.model.js')

let classes=[];
let startDate=Date.now()

module.exports.getTimeTable=async (req,res,next)=>{
	Coordonateur.find()
	.then(async coordonateurs=>{
		for(coordo of coordonateurs)
		{
		for(classe of coordo.classes)
    {
	await Classe.findOne({_id:classe})
	.then(data=>classes.push(data))
	.catch(error=>console.log(error))
    }
    await Faculty.find({},{'filieres':1})
		.then(facuties=>{
			for(classe of classes)
			{
				for(facultie of facuties)
				{
					for(filiere of facultie.filieres)
					{
						if(classe.idFiliere==filiere._id)
							classe.nomFiliere=filiere.nomFiliere
					}

				}
			}
		})
		.catch(error=>console.log(error))
    coordo.classes=classes;
    classes=[];
	}
	res.status(200).json(coordonateurs)
    })
    .catch(error=>{
    	console.log(error)
    	res.status(500).json({error:'error'})
    })
}	

module.exports.postCoordo=(req,res,next)=>{
	// const coordo=new Coordonateur({
	// 	...req.body,{startDate:startDate}
	// })
	// coordo.save()
	// .then(()=>res.json({message:'effectué'}))
	// .catch(error=>{
	// 	console.log(error),
	// 	res.json({error:'erreur'})
	// })
}