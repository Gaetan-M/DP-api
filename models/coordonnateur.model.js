const mongoose = require('mongoose');
const horaireSchema = require('./horaire.model')

const Schema = mongoose.Schema;


const coordonnateurSchema = new Schema({
  idPersonnel: {
    type: String,
    required: true,
  },
  classes: [String],
  horaire:horaireSchema,
  startDate: {
    type: Date,
    require: true
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