var express= require("express");
var router = express.Router({mergeParams:true});
var Campground=require("../models/campground.js")
var Comment	= require("../models/comments.js")
var middleware= require("../middleware/index.js")
//==========
//Comments routes
//==========
//New route
router.get("/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

//create route
//adding middleware in case someone use postman to post a comment 
router.post("/",middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/"+foundCampground._id);
				}
				});
		}
});
});

//Edit comment
router.get("/comments/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
	   Comment.findById(req.params.commentId, function(err, foundComment){
		res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment})	
		})
});
		
//updated comment
router.put("/comments/:commentId", function(req, res){
	//find and update the correct campground
	//redirect to campground
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updated){
		if(err){
			console.log(err);
			return res.redirect("back");
		}
		console.log(updated);
		res.redirect("/campgrounds/"+req.params.id);
	} )
})

//delete comment
router.delete("/comments/:commentId", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentId, function(err){
		if(err){
			return res.redirect("/campgrounds")
		}
		req.flash("success", "Comment deleted");
		res.redirect("/campgrounds/"+req.params.id)
	});
})


module.exports=router;