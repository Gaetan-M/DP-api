const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EnseignantsSchema = new Schema({
	Matricule:{
		type:Number,
		required:true,
		unique:true
	},
	username:{
		type:String,
		required:true
	},
	cours:[],
	classes:[],
	filieres:[]
})
const Enseignants = mongoose.model('Enseignants', EnseignantsSchema);

module.exports = Enseignants;