const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const  Classe=require('../models/classe.model.js')
const  Coordonateur=require('../models/coordonnateur.model.js')
const  Personnel=require('../models/personnel.model.js')
const  Enseignants=require('../models/enseignants.model.js')
const  Faculty=require('../models/faculty.model.js')
const  Cours=require('../models/cours.model.js')
const  Module=require('../models/module.model.js')
const Forum=require('../models/forum.models.js')

var cours=[];
var username='';
var clas=[];
let mod=[];
const date=Date.now()


module.exports.forum=(req,res,next)=>{
	// Cours.find()
	// .then(cours=>{
 //      for(cour of cours)
 //      {
 //       const forum=new Forum({
 //       	idCour:cour._id
 //       })
 //       forum.save()
 //       .then(()=>console.log('oki'))
 //      }
 //      res.json({message:'fini'})
	// })
	// .catch(error=>console.log(error))
	Forum.find()
	.then(data=>res.json(data))
}

module.exports.getClasses=async (req,res,next)=>{
	await Classe.find()
	  .then(classes=>clas=classes)
	  .catch(error=>{
			console.log(error)
			res.status(404).json({error})})

	await Faculty.find({},{'filieres':1})
		.then(facuties=>{
			for(classe of clas)
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
			res.status(200).json(clas)
		})
		.catch(error=>console.log(error))
}

module.exports.getPersonnel=async (req,res,next)=>{  
	await Personnel.find()
		.then(personnel=>res.status(200).json(personnel))
		.catch(error=>res.status(404).json({error}))
}

module.exports.getFaculty=async (req,res,next)=>{
	await Faculty.find()
		.then(faculty=>res.status(200).json(faculty))
		.catch(error=>res.status(404).json({error}))
}
module.exports.getCours=async (req,res,next)=>{
	await Cours.find()
		.then(cour=>res.status(200).json(cour))
		.catch(error=>res.status(404).json({error}))
}
module.exports.getModules=async (req,res,next)=>{
	await Module.find()
		.then(modules=>mod=modules)
		.catch(error=>console.log(error))

	await Classe.find({},{"nomClasse":1})
		.then(classes=>
		{
			for(module of mod){
				for(classe of classes){
					if(module.idClasse==classe._id)
						module.nomClasse=classe.nomClasse
				}
			}
			res.status(201).json(mod);
	  })
		.catch(error=>console.log(error))
}



module.exports.newEnseignant= async (req,res,next)=>{
	console.log('req.body',req.body.module)
	const enseignant=new Enseignants({...req.body})
	enseignant.save()
	.then(()=>res.status(201).json({message:"enseignant enregistrée"}))
	.catch(error=>res.status(500).json({error:"erreur d'enregistrement"}))
// 	await Personnel.find({"Matricule":req.body.matricule},{"nom":1,"prenom":1})
// 	.then(personnel=>{console.log('personnel',personnel)
// 		username=`${personnel[0].nom} ${personnel[0].prenom}`
// 	})
// 	.catch(error=>console.log(error))

// 	await Enseignants.find({"Matricule":req.body.matricule},{"cours":1,"classes":1})
// 	.then(enseignant=>{
// 		console.log(enseignant)
// 		cours=enseignant.cours
// 		classes=enseignant.classes
// 		cours.push(req.body.cours)
// 		classes.push(req.body.classes)
// 	})
// 	.catch(error=>console.log(error))
// 	console.log('username:',username)
// 	const enseignant =new Enseignants({
// 		username:username,
// 		cours:cours,
// 		startDate: date,
// 		classes:classes
// 	})
// 	enseignant.save()
// 	.then(enseignant=>res.status(201).json(enseignant))
// 	.catch(error=>{console.log(error)
// 		res.status(404).json({error})})
// //   const {idFiliere,niveau,nomClasse,module}=req.body
// // const classe =new Classe({
// //   idFiliere: idFiliere,
// //   niveau: niveau,
// //   nomClasse:nomClasse,
// //   module:module
// // })
// // classe.save()
// // .then(()=>res.status(201).json({message:"effectué"}))
// // .catch(error=>{console.log(error)
// //   res.status(500).json({error:"non effectué"})})
}

module.exports.findenseignants=(req,res,next)=>{
	Enseignants.find()
		.then(enseignant=>res.status(200).json(enseignant))
		.catch(error=>res.status(404).json({error:'aucun coordonnateur trouvé'}))

}

exports.modifyEnseignants=(req,res,next)=>{
	Enseignants.updateOne({_id:req.params.id},{...req.body,_id:req.params.id})
		.then(()=>res.status(201).json({message:'article a bien été modifié'}))
		.catch(error=>res.status(400).json({error}))
}
