const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const coursSchema=Schema({
  startDate: {
    type:Date,
    required:true
  },
  codeCour: {
    type:String,
    required:true,
    unique: true
  },
  nomCour: {
    type:String,
    required:true
  },
  poids: {
    type:String,
    required:true
  },
  classes: [], 
  idEnseignant: {
    type: String,
    required: true
  },
  history: [
    {
      _id: String,
      startDate: Date,
      changeDate: Date,
      codeCour: String,
      nomCour: String,   	
      poids: String,   	
      idEnseignant: String,
      classes: [String]
    }
  ]
})

const Cours = mongoose.model('Cours', coursSchema);

module.exports=Cours