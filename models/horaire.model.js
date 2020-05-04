const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const horaireSchema = new Schema({
  debutJournee: {
    type: Date
  },
  finJournee: {
    type: Date
  },
  dureeCour: {
    type: Date
  },
  heurePause: [
  	{
  		heure: Date,
  		duree: Date,
  	}
  ],
  startDate: {
    type: Date
  },
  history: [
  	{
  		_id: String,
  		debutJournee: Date,
  		finJournee: Date,
  		dureeCour: Date,
  		heurePause: [
  			{
  				heure: Date,
  				duree: Date
  			}
  		],
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

module.exports = horaireSchema;