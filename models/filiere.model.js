const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const filiereSchema = new Schema({
  nomFiliere: {
    type: String,
    required: true
  },
  maxNiveau: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		nomFiliere: String,
      maxNiveau: Number,
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

module.exports = filiereSchema;