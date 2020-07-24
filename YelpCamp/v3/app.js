var express=require("express"),
	app=express(),
	bodyParser = require("body-parser"),
	mongoose= require("mongoose"),
	Campground= require("./models/campground.js"),
	Comment	= require("./models/comments.js"),
	seedDB = require("./seeds.js")


mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
seedDB();

//index route 
app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
	if(err){
		console.log("something wrong");
	}else{
		console.log("access db");
		res.render("campgrounds/index", {campgrounds:campgrounds})
	}
});
});

//New route
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//create route
app.post("/campgrounds", function(req, res){
	var name=req.body.name
	var image= req.body.image
	var desc= req.body.description
	var newCamp={name:name, 
				image:image,
				description: desc};
	Campground.create(newCamp,function(err, newCampground){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});


// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
			console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})


//==========
//Comments routes
//==========
//New route
app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

//create route
app.post("/campgrounds/:id", function(req, res){
	var text=req.body.text
	var author= req.body.author
	var newComment={text: text,
				   author: author};
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			Comment.create(newComment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/"+foundCampground._id);
				}
				});
		}
});
});


app.listen(3000, function(){
	console.log("server connected");
});