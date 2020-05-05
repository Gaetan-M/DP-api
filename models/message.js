const mongoose=require('mongoose');

const messageSchema=mongoose.Schema({
date:Date,
dateTime:Date,
idEtudiant:Boolean,
message:String,
refFile:String,
isEnseignant:Boolean
})

module.exports=messageSchema;