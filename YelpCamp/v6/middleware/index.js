var Campground=require("../models/campground.js")
var Comment	= require("../models/comments.js")

var middlewareObj ={}



middlewareObj.checkCampgroundOwnership= function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
	   Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			return res.redirect("back");
		}
		  //check if user own this campground
		if(foundCampground.author.id.equals(req.user._id)){
			return next();	
		}else{
			res.send("No permission")
		}
		
		})
	}else{
		res.send("you need to log in first")	
	}	
}


middlewareObj.checkCommentOwnership= function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
	   Comment.findById(req.params.commentId, function(err, foundComment){
		if(err){
			return res.redirect("back");
		}
		  //check if user own this campground
		if(foundComment.author.id.equals(req.user._id)){
			return next();	
		}else{
			res.send("No permission")
		}
		})
	}else{
		res.send("you need to log in first")	
	}	
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	res.redirect("/signin");
}



module.exports =middlewareObj