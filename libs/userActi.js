var mongoose = require('mongoose');

mongoose.connect('mongodb://cyan:123456@ds147454.mlab.com:47454/comevents',{useMongoClient: true});
var db = mongoose.connection;

//Usre Schema
var UserActiSchema = mongoose.Schema({
    userID:{
      type:String
    },
    actiID:{
      type:String
    },
    state:{
      type:Number
    },
    time:{
      type:Number
    }
});
var UserActi = module.exports = mongoose.model('vol_acti',UserActiSchema);
module.exports.getUsersByActi = function(ActivityID,callback){
    var query={actiID:ActivityID};
    UserActi.find(query,callback);
}
module.exports.updateOne=function(id,change,callback){
  var query={_id:id};
  UserActi.update(query,change,callback);
}
// module.exports.getAllUsers = function(callback){
//   var query={};
//   User.find(query,callback);
// };
// module.exports.getUser = function(id,callback){
//   var query={_id:id};
//   console.log("id",id);
//   User.findOne(query,callback);
// };