var mongoose = require('mongoose');

mongoose.connect('mongodb://cyan:123456@ds147454.mlab.com:47454/comevents',{useMongoClient: true});
var db = mongoose.connection;

//Usre Schema
var UserSchema = mongoose.Schema({
    username:{
   		type:String
  	},
  	password:{
    	type:String
  	},
  	email:{
   		type:String
  	},
  	name:{
    	type:String
  	},
  	// 时长
  	profileimage:{
    	type:String
  	},
  	times:{
   		type:Number
  	}
});
var User = module.exports = mongoose.model('User',UserSchema);

module.exports.getAllUsers = function(callback){
  var query={};
  User.find(query,callback);
};
module.exports.getUser = function(id,callback){
  var query={_id:id};
  console.log("id",id);
  User.findOne(query,callback);
};
