const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const classeSchema = new Schema({
  idFiliere: {
    type: String,
    required: true,
  },
  nomFiliere:String,
  nomClasse:{
    type: String,
    required: true,
  },
  niveau: {
  	type: Number,
  	required: true,
  },
  history: [
  	{
  		_id: String,
  		idFiliere: String,
  		niveau: Number,
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});
const Classe = mongoose.model('Classe', classeSchema);

module.exports = Classe;