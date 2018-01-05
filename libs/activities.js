var mongoose = require('mongoose');

mongoose.connect('mongodb://cyan:123456@ds147454.mlab.com:47454/comevents',{useMongoClient: true});
var db = mongoose.connection;

//Usre Schema
var ActivitySchema = mongoose.Schema({
    name:{
   		type:String
  	},
  	date:{
    	type:String
  	},
  	address:{
   		type:String
  	},
  	intro:{
    	type:String
  	},
  	// 时长
  	time:{
    	type:Number
  	},
  	publisher:{
   		type:String
  	},
  	image:{
    	type:Array
  	},
  	requirement:{
  		type:String
  	},
  	welfare:{
  		type:String
  	},
    state:{
      type:Number
    }
});
var Activity = module.exports = mongoose.model('Activity',ActivitySchema);

module.exports.getAllActivities = function(callback){
  var query={};
  Activity.find(query,callback);
};
module.exports.getActivity = function(id,callback){
  var query={_id:id};
  console.log("id",id);
  Activity.findOne(query,callback);
};
module.exports.getStateActivities = function(state,callback){
  var query={state:state};
  Activity.find(query,callback);
}
module.exports.deleteOne = function(id,callback){
  var query={_id:id};
  Activity.remove(query,callback);
}
module.exports.updateOne = function(id,change,callback){
  var query={_id:id};
  console.log(query);
  Activity.update(query,change,callback);
}
module.exports.addOne = function(data,callback){
  var query=data;
  Activity.insertMany(query,callback);
}
module.exports.getUserActivity = function(publisher,callback){
  var query={publisher:publisher}
  Activity.find(query,callback);
}