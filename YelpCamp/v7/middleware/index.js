var Campground=require("../models/campground.js")
var Comment	= require("../models/comments.js")

var middlewareObj ={}



middlewareObj.checkCampgroundOwnership= function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
	   Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found.");
			return res.redirect("back");
		}
		  //check if user own this campground
		if(foundCampground.author.id.equals(req.user._id)){
			return next();	
		}else{
			req.flash("error", "Permission denied");
			res.redirect("/campgrounds/"+req.params.id)
		}
		
		})
	}else{
		req.flash("error", "Please Login First");
		res.redirect("/signin");	
	}	
}


middlewareObj.checkCommentOwnership= function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
	   Comment.findById(req.params.commentId, function(err, foundComment){
		if(err){
			return res.redirect("back");
		}
	   if (!foundComment) {
			req.flash("error", "Comment not found.");
			return res.redirect("back");
		}
		  //check if user own this campground
		if(foundComment.author.id.equals(req.user._id)){
			return next();	
		}else{
			req.flash("error", "Permission denied");
			res.redirect("/campgrounds/"+req.params.id)
		}
		})
	}else{
		req.flash("error", "Please Login First");
		res.redirect("/signin");	
	}	
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	req.flash("error", "Please Login First");
	res.redirect("/signin");
}



module.exports =middlewareObj