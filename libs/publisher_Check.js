var mongoose = require('mongoose');

mongoose.connect('mongodb://cyan:123456@ds147454.mlab.com:47454/comevents',{userMongoClent: true});
var db = mongoose.connection;

// _id
// :
// 5a44c8373b96396308a7b54d
// username
// :
// "ncepu"
// name
// :
// "华北电力大学"
// password
// :
// "123456"
// state
// :
// 1
// address
// :
// "昌平区北农路2号"
// leader
// :
// "Bruth"
// tel
// :
// "18810002562"
// leaderID
// :
// "231022199602032253"

var PublisherSchema = mongoose.Schema({
	username:{
  	 	type:String
  	},
  	name:{
    	type:String
  	},
  	password:{
   		type:String
  	},
  	state:{
    	type:Number
  	},
  	// 时长
  	address:{
    	type:String
  	},
  	leader:{
   		type:String
  	},
  	tel:{
    	type:String
  	},
  	leaderID:{
  		type:String
  	}
});

var Publisher = module.exports = mongoose.model('Publisher',PublisherSchema);
module.exports.checkPublisher = function(username,password,callback){
	var query = {username:username,password:password};
	Publisher.findOne(query,callback);
}
module.exports.getStatePublisher = function(state,callback){
	var query = {state:state};
	Publisher.find(query,callback);
}
module.exports.getPublisher = function(id,callback){
	var query = {_id:id};
	Publisher.findOne(query,callback);
}
module.exports.getPublisherByUserName = function(username,callback){
	var query = {username:username};
	Publisher.findOne(query,callback);
}
module.exports.updateOne = function(id,change,callback){
  var query={_id:id};
  console.log(query);
  Publisher.update(query,change,callback);
}
module.exports.deleteOne = function(id,callback){
	var query={_id:id};
	Publisher.remove(query,callback);
}
module.exports.addOne = function(data,callback){
	var query=data;
	query.state=0;
	Publisher.insertMany(query,callback);
}