const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const  Classe=require('../models/classe.model.js')
const  Coordonateur=require('../models/coordonnateur.model.js')
const  Faculty=require('../models/faculty.model.js')
const  Personnel=require('../models/personnel.model.js')
const  TimeTable=require('../models/timeTable.model.js')

let classes=[];
let startDate=Date.now()

module.exports.getCoordo=async (req,res,next)=>{
	Coordonateur.findById({idCoordonnateur:req.body.idCoordo})
	.then(async coordo=>{

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
	res.status(200).json(coordonateurs)
    })
    .catch(error=>{
    	console.log(error)
    	res.status(500).json({error:'error'})
    })
}	

module.exports.postCoordo=(req,res,next)=>{
	const time =new TimeTable({...req.body})
	time.save()
		.then(()=>res.status(201).json({coordo:'create'}))
		.catch(error=>res.status(400).json({error}))

}
module.exports.getTimeTable=(req,res,next)=>{
	Coordonateur.find()
	.then(coordo=>res.json(coordo))
	.catch(error=>res.json(error))
}