const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const timeTableSchema = new Schema({
  idCour: {
    type: String,
    required: true,
  },
  idClasse: {
    type: String,
    required: true
  },
  idHoraire: {
    type: String,
    required: true
  },
  dateDebutSemaine: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    require: true
  },
  cours: [
  	{
  		tablePosition: Number,
  		idCour: String,
  		idSalle: String,
  		idNatureCours: String,
  		canceled: Boolean,
  	}
  ],
  history: [
  	{
  		_id: String,
  		idCour: String,
  		idClasse: String,
  		idSalle: String,
  		idHoraire: String,
  		dateDebutSemaine: Date,
  		startDate: Date,
  		changeDate: Date,
  		cours: [
  			{
		 			tablePosition: Number,
		  		idCour: String,
		  		idSalle: String,
		  		idNatureCours: String,
		  		canceled: Boolean,
  			}
  		],
  	}
  ]
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;