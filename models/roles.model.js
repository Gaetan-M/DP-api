const mongoose=require('mongoose');

const roleSchema=mongoose.Schema({
	nomRole:{
		type:String,
		required:true
	}
})

module.exports=roleSchema;