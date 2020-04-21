const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken')
const  Faculty=require('../models/faculty.model.js')
const  Coordonateur=require('../models/coordonnateur.model.js')
const  Personnel=require('../models/personnel.model.js')
const  Classe=require('../models/classe.model.js')

  var username='';
  var listClasses=[];
  const date=Date.now()

module.exports.getfaculty=(req,res,next)=>{
  Faculty.find({},{"filieres":1,"nomFaculty":1})
  .then(faculty=>res.status(200).json(faculty))
  .catch(error=>res.status(404).json({error}))
}

module.exports.newCordonnateur= async (req,res,next)=>{
  console.log('req.body',req.body)
  
  await Personnel.find({"Matricule":req.body.matricule},{"nom":1,"prenom":1})
  .then(personnel=>{console.log('personnel',personnel)
    username=`${personnel[0].nom} ${personnel[0].prenom}`
  })
  .catch(error=>console.log(error))

  await Classe.find({"idFiliere": req.body.idFiliere},{"nomClasse":1})
  .then(classe=>{console.log('classe',classe)
    for(const clas of classe){
     listClasses.push(clas.nomClasse)
    }
    console.log('classe:',listClasses)
  })
  .catch(error=>console.log(error))
  console.log('username:',username)
  const coordonateur =new Coordonateur({
    username:username,
    classes:listClasses ,
    startDate: date
  })
  coordonateur.save()
  .then(coordonateur=>res.status(201).json(coordonateur))
  .catch(error=>{console.log(error)
    res.status(404).json({error})})

}

module.exports.findCordonnateur=(req,res,next)=>{
Coordonateur.find()
.then(coordonateur=>res.status(200).json(coordonateur))
.catch(error=>res.status(404).json({error:'aucun coordonnateur trouvé'}))

}

exports.modifyCoordonnateur=(req,res,next)=>{
  Coordonateur.updateOne({_id:req.params.id},{...req.body,_id:req.params.id})
  .then(()=>res.status(201).json({message:'article a bien été modifié'}))
  .catch(error=>res.status(400).json({error}))
}

// exports.deleteCoordonnateur=(req,res,next)=>{
//     Personnel.findOne({_id:req.params.id})
//   .then((personnel)=>{
//     res.status(201).json({message:'oki'})

//       let history={
//     password:personnel.password,
//         Matricule:personnel.Matricule,
//         email: personne.email,
//         nom: personnel.nom,
//         prenom: personnel.prenom,
//         tel: personnel.tel,
//         startDate:personnel.startDate,
//       }
//     console.log(history)
//   // let historyRole={
//   //  _id:personnel.role._id,
//   //  nomRole:personnel.role.nomRole,
//   //  startDate:personnel.startDate
//   // }
//   })
//   .catch(error=>res.status(404).json({error}))


//   // Personnel.deleteOne({_id:req.params.id})
//   // .then(()=>res.status(200).json({message:'supperssion reussie'}))
//   // .catch(error=>res.status(404).json({error}))
// }