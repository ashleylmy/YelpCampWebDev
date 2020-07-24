var express=require("express"),
	app=express(),
	bodyParser = require("body-parser"),
	mongoose= require("mongoose")


mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
})

var Campground= mongoose.model("Campground", campgroundSchema);

// Campground.create({
// 	name: "Mountain Goat's Rest", 
// 	image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
// 	description: "This is a huge granite hill, no bathrooms.  No water. Beautiful 			granite!"
// }, function(err, campground){
// 	if(err){
// 		console.log("something wrong");
// 	}else{
// 		console.log(campground);
// 	}
// });


app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, campgrounds){
	if(err){
		console.log("something wrong");
	}else{
		console.log("access db");
		console.log(campgrounds);
		res.render("index", {campgrounds:campgrounds})
	}
});
});

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

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})

app.listen(3000, function(){
	console.log("server connected");
});