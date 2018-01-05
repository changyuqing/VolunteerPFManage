const express=require('express');
const pathLib=require('path');
const fs=require('fs');
const Publisher=require('../libs/publisher_Check');
const Activity=require('../libs/activities');
const UserActi=require('../libs/userActi.js');
const User=require('../libs/users.js');

module.exports=function(){
	var router=express.Router();
	router.get('/signup',(req,res)=>{
		res.render('./usignup.ejs',{info:'',data:''});
	});
	router.post('/signup',(req,res)=>{
		var info='';
		Publisher.getPublisherByUserName(req.body.username,function(err,publisher){
			if(err){
				console.log(err);
			}else{
				if(publisher!=null){
					info="用户名已存在或正在审核";
					res.render('./usignup.ejs',{info:info,data:req.body});
				}else{
					if(req.body.password!=req.body.repassword){
						info="输入的两次密码不匹配";
						res.render('./usignup.ejs',{info:info,data:req.body});
					}
					if(req.body.password.length<6){
						info="密码强度过低";
						res.render('./usignup.ejs',{info:info,data:req.body});
					}
					Publisher.addOne(req.body,function(err){
						if(err){
							console.log(err);
						}
					})
					res.redirect('/publisher/login');
				}
			}
		})
	})
	router.use((req,res,next)=>{
		if(!req.session['publisher_id']&&req.url!='/login'){
			res.redirect('/publisher/login');
		}else{
			next();
		}
	});

	router.get('/login',(req,res)=>{
		res.render('./ulogin.ejs',{info:'',username:'',password:''});
	});
	router.post('/login',(req,res)=>{
		var username=req.body.username;
		var password=req.body.password;
		Publisher.checkPublisher(username,password,function(err,publisher){
			if(err){
				res.status(500).send('database error').end();
			}else{
				if(!publisher){
					console.log(username+password);
					res.render('./login.ejs',{info:"用户名或密码错误",username:username,password:password});

				}else{
					if(publisher.state==0){
						res.render('./login.ejs',{info:"该用户正在待审核状态",username:username,password:password});
					}else{
					req.session['publisher_id']=publisher._id;
					req.session['publisher_name']=publisher.name;
					res.redirect('/publisher/index');}
				}
			}
		})
	});
	router.get('/index',(req,res)=>{
		res.render('./upublisherIndex.ejs',{info:'',username:'',password:''});
	});
	router.get('/outLogin',(req,res)=>{
		req.session['publisher_name']=null;
		req.session['publisher_id']=null;
		res.redirect('/publisher/publisherManage');
	})
	router.get('/publisherManage',(req,res)=>{
		res.render('./upublisherManage.ejs');
	});
	router.get('/createActivity',(req,res)=>{
		res.render('./ucreateActivity.ejs');
	});
	router.post('/createActivity',(req,res)=>{
		var oldPath=req.files[0].path;
		var ext=pathLib.parse(req.files[0].originalname).ext
		var newPath=req.files[0].path+ext;
		var realPath="/images/"+req.files[0].filename+ext;
		fs.rename(oldPath,newPath,(err)=>{
			if(err){
				res.status(500).send("file operation error");
			}else{
				req.body.state=0;
				req.body.image=realPath;
				req.body.publisher=req.session['publisher_name'];
				Activity.addOne(req.body,(err)=>{
					if(err){
						res.status(500).send("submitted failed");
					}else{
						res.redirect('/publisher/activitiesList');
					}
				});
			}
		})
	});
	router.get('/activitiesList',(req,res)=>{
		switch(req.query.act){
			case "end":
				Activity.updateOne(req.query.id,{$set:{state:2}},function(err){
					if(err){
						res.status(500).send("database error");
					}else{
						Activity.getUserActivity(req.session['publisher_name'],function(err,data){
							if(err){
								res.status(500).send("database error");
							}else{
								console.log(data);
								res.render('./uactivitiesList.ejs',{data:data});
							}
						});
					}
				});
			break;
			case "detail":
				Activity.getActivity(req.query.id,function(err,data){
					if(err){
						res.status(500).send("database error");
					}else{
						var Data=[];
						if(data.state===1){
							UserActi.getUsersByActi(req.query.id,function(err,users){
								if(err){
									res.status(500).send("database error");
								}else{
									res.render('./uactivityDetail.ejs',{data:data,user:users});
								}
							})
							
						}else{
							res.render('./uactivityDetail.ejs',{data:data,user:''});
						}
					}
				});
			break;
			case "nice":
			UserActi.updateOne(req.query.id,{$set:{state:2,time:req.query.time}},function(err){
				if(err){
					res.status(500).send("database error");
				}else{
					res.redirect('/publisher/activitiesList?act=assess&id='+req.query.actiID);
				}
			})
			break;
			case "bad":
			UserActi.updateOne(req.query.id,{$set:{state:2,time:0}},function(err){
				if(err){
					res.status(500).send("database error");
				}else{
					res.redirect('/publisher/activitiesList?act=assess&id='+req.query.actiID);
				}
			});
			break;
			case "assess":
			Activity.getActivity(req.query.id,function(err,data){
					if(err){
						res.status(500).send("database error");
					}else{
						if(data.state===2){
							UserActi.getUsersByActi(req.query.id,function(err,users){
								if(err){
									res.status(500).send("database error");
								}else{
									res.render('./uassessActivity.ejs',{data:data,user:users});
								}
							})
							
						}
					}
				});
			break;
			case "actiEnding":
			Activity.updateOne(req.query.id,{$set:{state:3}},function(err){
					if(err){
						res.status(500).send("database error");
					}else{
						Activity.getUserActivity(req.session['publisher_name'],function(err,data){
							if(err){
								res.status(500).send("database error");
							}else{
								console.log(data);
								res.render('./uactivitiesList.ejs',{data:data});
							}
						});
					}
				});
			break;
			case "mod":
			Activity.getActivity(req.query.id,function(err,data){
				if(err){
					res.status(500).send("database error");
				}else{
					res.render('./umodifyActivity.ejs',{data:data});
				}
			});
			break;
			case "del":
			Activity.deleteOne(req.query.id,function(err){
				if(err){
					res.status(500).send('database error');
				}else{
					res.redirect('/publisher/activitiesList');
				}
			})
			break;
			case "pass":
			UserActi.updateOne(req.query.id,{$set:{state:1}},function(err){
				if(err){
					res.status(500).send("database error");
				}else{
					res.redirect('/publisher/activitiesList?act=detail&id='+req.query.actiID);
				}
			})
			break;
			case "reject":
			UserActi.updateOne(req.query.id,{$set:{state:-1}},function(err){
				if(err){
					res.status(500).send("database error");
				}else{
					res.redirect('/publisher/activitiesList?act=detail&id='+req.query.actiID);
				}
			})
			break;
			default:
			Activity.getUserActivity(req.session['publisher_name'],function(err,data){
				if(err){
					res.status(500).send("database error");
				}else{
					console.log(data);
					res.render('./uactivitiesList.ejs',{data:data});
				}
			});
			break;
		}
	});
	router.post('/activitiesList',(req,res)=>{
		if(req.files[0]!=null){
			var oldPath=req.files[0].path;
			var ext=pathLib.parse(req.files[0].originalname).ext
			var newPath=req.files[0].path+ext;
			var realPath="/images/"+req.files[0].filename+ext;
			fs.rename(oldPath,newPath,(err)=>{
				if(err){
					res.status(500).send("file operation error");
				}else{
					req.body.state=0;
					req.body.image=realPath;
					Activity.updateOne(req.body._id,{$set:{
						image:realPath
					}},(err)=>{
						if(err){
							res.status(500).send("database error");
						}
					});
				}
		})}
		Activity.updateOne(req.body._id,{$set:{
			name:req.body.name,
			date:req.body.date,
			address:req.body.address,
			time:req.body.time,
			intro:req.body.intro,
			requirement:req.body.requirement,
			welfare:req.body.welfare,
			state:0
		}},(err)=>{
			if(err){
				res.status(500).send("database error");
			}
		});
		res.redirect('/publisher/activitiesList');
	});
	return router;
}