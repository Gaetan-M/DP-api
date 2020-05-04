const mongoose=require('mongoose');

const Schema = mongoose.Schema;

const moduleSchema = Schema({
	codeModule:{
    type:String,
    required:true,
    unique:true
  },
	nomModule:{
    type:String,
    required:true
  },
	idClasse:{
    type:String,
    required:true
  },
  nomClasse:String,
	credit:{
    type: Number,
    required: true
  },
  startDate: {
    type:Date,
    required: true
  },
	cours: [
    {
      codeCours: String,
      poids: String
    }
  ],
  history: [
    {
      _id:String,
  	  codeModule:String,
  	  nomModule:String,
  	  idClasse:String,
  	  credit:Number,
      startDate:Date,
      changeDate: Date,
  	  cours: [
        {
          codeCours:String,
          poids:String
        }
      ]
    }
  ]
})

module.exports=mongoose.model('Module',moduleSchema)