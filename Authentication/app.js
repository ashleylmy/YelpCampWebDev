var express=require("express"),
	app=express(),
	passport=require("passport"),
	bodyParser = require("body-parser"),
	mongoose= require("mongoose"),
	User= require("./models/user.js"),
	LocalStrategy= require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose")
	
//app config
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/auth_demo', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized: true
		}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=======
//routes
//=======
app.get("/", function(req, res){
    res.render("home");
});


app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});


//auth routes
//1. show new form
app.get("/register", function(req, res){
	res.render("register");
})
//2. post new form to db
app.post("/register", function(req, res){
	console.log("print out req.body");
	console.log(req.body);
	User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
		if(err){
			console.log("something went worng");
			console.log(err);
			return res.render('register');
		}
			passport.authenticate('local')(req, res, function(){
			res.redirect("/secret");
			console.log(req.body);
			})	
		});
});

//login routes
//1. show login form
app.get("/login", function(req, res){
	res.render("login");
})
//2. check if input exsit, redirect to secret
//middleware
app.post("/login", passport.authenticate("local", {
	successRedirect:"/secret",
	failureRedirect:"/login"
}), function(req, res){
		});


//logout
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/")
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}


app.listen(3000, function(){
    console.log("server started.......");
})