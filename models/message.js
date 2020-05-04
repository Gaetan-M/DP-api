const mongoose=require('mongoose');

const messageSchema=mongoose.Schema({
date:Date,
dateTime:Date,
idEtudiant:String,
message:String,
refFile:String,
isEnseignant:Boolean
})

module.exports=messageSchema;