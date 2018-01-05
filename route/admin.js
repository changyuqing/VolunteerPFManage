const express=require('express');
const Admin=require('../libs/admin_Check');
const Activity=require('../libs/activities');
const User=require('../libs/users');
const Publisher=require('../libs/publisher_Check');

module.exports=function(){
	var router=express.Router();
	router.use((req,res,next)=>{
		if(!req.session['admin_id']&&req.url!='/login'){
			res.redirect('/admin/login');
		}else{
			next();
		}
	});
	router.get('/login',(req,res)=>{
		res.render('./login.ejs',{info:'',username:'',password:''});
	});
	router.post('/login',(req,res)=>{
		var username=req.body.username;
		var password=req.body.password;
		Admin.checkById_password(username,password,function(err,admin){
			if(err){
				res.status(500).send('database error').end();
			}else{
				if(!admin){
					console.log(username+password);
					res.render('./login.ejs',{info:"用户名或密码错误",username:username,password:password});

				}else{
					req.session['admin_id']=admin._id;
					res.redirect('/admin/activityManage');
				}
			}
		})
	});
	router.get('/outLogin',(req,res)=>{
		req.session['admin_id']=null;
		res.redirect('/admin/activityManage');
	});
	router.get('/activityManage',(req,res)=>{
		switch(req.query.act){
			case "display":
				Activity.getActivity(req.query.id,function(err,activity){
					if(err){
						console.log(err);
					}else{
						res.render('./activityDetail.ejs',{data:activity});
					}
				})
				
			break;
			case "del":
				Activity.deleteOne(req.query.id,function(err){
					if(err){
						console.log(err);
					}else{
						Activity.getStateActivities(1,function(err,activities){
						if(err){
							console.log(err);
						}else{
							res.render('./activityManage.ejs',{data:activities});
						}
					})	
					}
				})
			break;
			default:
			Activity.getStateActivities(1,function(err,activities){
						if(err){
							console.log(err);
						}else{
							res.render('./activityManage.ejs',{data:activities});
						}
					})	
			break;
		}
			
	});
	router.get('/activityCheck',(req,res)=>{
		switch(req.query.act){
			case "display":
			Activity.getActivity(req.query.id,function(err,activity){
				if(err){
					console.log(err);
				}else{
					res.render('./activityAudit.ejs',{data:activity});
				}
			})
			break;
			case "pass":
			Activity.updateOne(req.query.id,{$set:{state:1}},function(err){
				if(err){
					console.error(err);
				}else{
					Activity.getStateActivities(0,function(err,activities){
						if(err){
							console.log(err);
						}else{
							res.render('./activityCheck.ejs',{data:activities});
						}
					})	

				}
			})
			break;
			case "reject":
			Activity.updateOne(req.query.id,{$set:{state:-1}},function(err){
				if(err){
					console.error(err);
				}else{
					console.log('修改成功');
					Activity.getStateActivities(0,function(err,activities){
						if(err){
							console.log(err);
						}else{
							res.render('./activityCheck.ejs',{data:activities});
						}
					})	

				}
			})
			default:
			Activity.getStateActivities(0,function(err,activities){
				if(err){
					console.log(err);
				}else{
					res.render('./activityCheck.ejs',{data:activities});
				}
			})
			break;
		}
		
	});
	router.get('/publisherManage',(req,res)=>{
		switch(req.query.act){
			case "display":
			Publisher.getPublisher(req.query.id,function(err,publisher){
				if(err){
					console.log(err);
				}else{
					res.render('./publisherDetail.ejs',{data:publisher});
				}
			})
			break;
			case "del":
			Publisher.deleteOne(req.query.id,function(err,publisher){
				if(err){
					res.status(500).send('database error');
				}else{
					res.redirect('/admin/publisherManage');
				}
			})
			break;
			default:
			Publisher.getStatePublisher(1,function(err,publisher){
				if(err){
					console.log(err);
				}else{
					res.render('./publisherManage.ejs',{data:publisher});
				}
			});
			break;
		}
		
	});
	router.get('/publisherCheck',(req,res)=>{
		switch(req.query.act){
			case "display":
			Publisher.getPublisher(req.query.id,function(err,publisher){
				if(err){
					console.log(err);
				}else{
					res.render('./publisherAudit.ejs',{data:publisher});
				}
			})
			break;
			case "pass":
			Publisher.updateOne(req.query.id,{$set:{state:1}},function(err){
				if(err){
					console.error(err);
				}else{
					console.log('修改成功');
					Publisher.getStatePublisher(0,function(err,publisher){
						if(err){
							console.log(err);
						}else{
							res.render('./publisherCheck.ejs',{data:publisher});
						}
					})	

				}
			})
			break;
			case "reject":
			Publisher.deleteOne(req.query.id,function(err){
				if(err){
					console.error(err);
				}else{
					Publisher.getStatePublisher(0,function(err,publisher){
						if(err){
							console.log(err);
						}else{
							res.render('./publisherCheck.ejs',{data:publisher});
						}
					})	

				}
			})
			break;
			
			default:
			Publisher.getStatePublisher(0,function(err,publisher){
				if(err){
					console.log(err);
				}else{
					res.render('./publisherCheck.ejs',{data:publisher});
				}
			})
			break;
		}
		
	});

	return router;
}