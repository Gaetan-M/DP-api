const mongoose = require('mongoose');
const filiereSchema = require('./filiere.model')

const Schema = mongoose.Schema;


const facultySchema = new Schema({
  nomFaculty: {
    type: String,
    required: true,
    unique: true,
  },
  filieres: [filiereSchema],
  startDate: {
    type: Date,
    require: true
  },
  history: [
  	{
  		_id: String,
  		nomFaculty: String,
      filieres: [],
  		startDate: Date,
  		changeDate: Date
  	}
  ]
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;