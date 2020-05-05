const mongoose=require('mongoose')

const supportSchema=mongoose.Schema({
	idCour:{type:String,required:true},
	supports:{
		filename:String,
		_id:String,
		chunkSize:Number,
		uploadDate:Date,
		md5:String,
		isImage:Boolean,
		length:Number

	}
})

module.exports=mongoose.model('Support',supportSchema)