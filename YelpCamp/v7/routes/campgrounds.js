var express= require("express");
var router = express.Router();
var Campground=require("../models/campground.js")
var Comment	= require("../models/comments.js")
var middleware= require("../middleware/index.js")

//index route 
router.get("/", function(req, res){
	console.log(req.user);
	Campground.find({}, function(err, campgrounds){
	if(err){
		console.log("something wrong");
	}else{
		console.log("access db");
		res.render("campgrounds/index", {campgrounds:campgrounds})
	}
});
});

//New form for campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//create new campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
	var name=req.body.name
	var image= req.body.image
	var desc= req.body.description
	var author= {
		id:req.user._id,
		username: req.user.username
	}
	var newCamp={name:name, 
				image:image,
				description: desc,
				author: author};
	Campground.create(newCamp,function(err, newCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});


// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	   Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground})	
		})
});
		
//updated campground
router.put("/:id", function(req, res){
	//find and update the correct campground
	//redirect to campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
		if(err){
			console.log(err);
			return res.redirect("/");
		}
		res.redirect("/campgrounds/"+req.params.id);
	} )
})

//delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			return res.redirect("/campgrounds")
		}
		req.flash("success", "Campground deleted");
		res.redirect("/campgrounds")
	});
})


module.exports=router;
