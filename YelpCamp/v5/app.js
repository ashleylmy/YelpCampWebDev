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

//=====
//routes
//=====
var campgroundsRoutes= require("./routes/campgrounds.js"),
	commentsRoutes= require("./routes/comments.js"),
	authRoutes= require("./routes/auth.js")



//mongoose config
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
app.use("/", authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id", commentsRoutes);

app.listen(3000, function(){
	console.log("server connected");
});