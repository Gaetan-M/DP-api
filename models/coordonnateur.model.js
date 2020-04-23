const mongoose = require('mongoose');
const horaireSchema = require('./horaire.model')

const Schema = mongoose.Schema;


const coordonnateurSchema = new Schema({
  idPersonnel: {
    type: String,
    required: true,
  },
  classes: [],
  horaire:horaireSchema,
  startDate: {
    type: Date,
    required: true
  },
  history: [
  	{
  		_id: String,
  		idPersonnel: String,
      classes: [String],
      horaire:horaireSchema,
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

const Coordonnateur = mongoose.model('Coordonnateur', coordonnateurSchema);

module.exports = Coordonnateur;