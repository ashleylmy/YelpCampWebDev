var express=require("express"),
	app=express(),
	bodyParser = require("body-parser"),
	mongoose= require("mongoose"),
	passport= require("passport"),
	LocalStrategy= require("passport-local"),
	User= require("./models/user.js"),
	Campground= require("./models/campground.js"),
	Comment	= require("./models/comments.js"),
	seedDB = require("./seeds.js"),
	session=require("express-session")


mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
seedDB();

//PASSPORT CONFIG
app.use(session({
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware function pass to header to check login status
app.use(function(req, res, next){
	res.locals.currentUser =req.user;
	next();
})

//index route 
app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
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

//New route
app.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//create route
app.post("/campgrounds", isLoggedIn, function(req, res){
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
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
app.post("/campgrounds/:id",isLoggedIn, function(req, res){
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


//=====
//Auth route
//=====

//show register
app.get("/signup", function(req, res){
	res.render("auth/signup");
})

app.post("/signup", function(req, res){
	var newUser=new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log("something is wrong");
			console.log(err);
			return res.redirect("/signup");
		}
		passport.authenticate("local")(req, res, function(){
			console.log("new user registered");
			res.redirect("/campgrounds")
		})
	})
})

//sign in 
app.get("/signin", function(req, res){
	res.render("auth/signin");
})

//handle sign in 
//use middleware
app.post("/signin", 
		 passport.authenticate("local", {
		successRedirect:"/campgrounds",
		failureRedirect:"/signin"
}),
		 function(req, res){
});

//signout
app.get("/signout", function(req, res){
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	res.redirect("/signin");
}


app.listen(3000, function(){
	console.log("server connected");
});