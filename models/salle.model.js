const mongoose = require('mongoose');

const  salleSchema = mongoose.Schema({
  nomSalle: {type: String, required: true},
  capacite: { type: String }
})

module.exports = mongoose.model('Salle', salleSchema)