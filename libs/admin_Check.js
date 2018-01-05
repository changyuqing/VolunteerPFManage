var mongoose = require('mongoose');

mongoose.connect('mongodb://cyan:123456@ds147454.mlab.com:47454/comevents',{useMongoClient: true});
var db = mongoose.connection;

//Usre Schema
var UserSchema = mongoose.Schema({
   username:{
        type:String,
        index:true
    },
    password:{
        type:String,
        require:true
    }
});
var Admin = module.exports = mongoose.model('Admin',UserSchema);
module.exports.checkById_password = function(username,password,callback){
    var query = {username:username,password:password};
    Admin.findOne(query,callback);
};