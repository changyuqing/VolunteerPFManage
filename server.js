const express=require('express');
const static=require('express-static');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest:'./static/images'});
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const consolidate=require('consolidate');
const expressRoute=require('express-route');

var server=express();
server.listen(8080);


//获取请求数据
server.use(bodyParser.urlencoded());
server.use(multerObj.any());

//cookie session
var keys=[];
for(var i=0;i<100000;i++){
	keys[i]='a_'+Math.random();
}
server.use(cookieParser());
server.use(cookieSession({
	name:'sess_id',
	keys:keys,
	maxAge:20*60*1000
}));

//模板
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//route
server.use('/admin/',require('./route/admin.js')());

server.use('/publisher/',require('./route/publisher.js')());

//static
server.use(static('./static'));