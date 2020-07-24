var express= require("express");
var router = express.Router();
var Campground=require("../models/campground.js")
var Comment	= require("../models/comments.js")

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
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//create new campgrounds
router.post("/", isLoggedIn, function(req, res){
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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	res.redirect("/signin");
}


module.exports=router;
