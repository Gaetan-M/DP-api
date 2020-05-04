const messageSchema=require('./message.js')

const mongoose=require('mongoose');

const forumSchema=mongoose.Schema({
	idCour:{type:String,required:true},
	messages:[messageSchema]
})

module.exports=mongoose.model('forum',forumSchema)