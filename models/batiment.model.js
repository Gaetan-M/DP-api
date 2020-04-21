const mongoose=require('mongoose');

const batimentSchema=mongoose.Schema({
  nomBatiment:{
    type:String,
    requied:true
  },
  idFaculty:{
    type:String,
    requied:true
  },
  salle_de_cours: [salleSchema],
  history:[
  	{
      nomBatiment:String,
	    idFaculty:String,
      salle_de_cours: [salleSchema],
    }
  ]
})

module.exports=mongoose.model('Batiment',batimentSchema);