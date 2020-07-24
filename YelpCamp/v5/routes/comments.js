var express= require("express");
var router = express.Router({mergeParams:true});
var Campground=require("../models/campground.js")
var Comment	= require("../models/comments.js")
//==========
//Comments routes
//==========
//New route
router.get("/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			console.log(campground);
			res.render("comments/new", {campground: campground});
		}
	});
});

//create route
//adding middleware in case someone use postman to post a comment 
router.post("/",isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			console.log(req.body);
			Comment.create(req.body, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					console.log(comment);
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/"+foundCampground._id);
				}
				});
		}
});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	res.redirect("/signin");
}


module.exports=router;