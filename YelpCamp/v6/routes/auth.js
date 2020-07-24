var express= require("express"),
	router = express.Router(),
	passport= require("passport"),
	User= require("../models/user.js")

//===
//root route
//===

router.get("/", function(req, res){
	res.render("landing");
});

//=====
//Auth route
//=====

//show register
router.get("/signup", function(req, res){
	res.render("auth/signup");
})

router.post("/signup", function(req, res){
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
router.get("/signin", function(req, res){
	res.render("auth/signin");
})

//handle sign in 
//use middleware
router.post("/signin", 
		 passport.authenticate("local", {
		successRedirect:"/campgrounds",
		failureRedirect:"/signin"
}),
		 function(req, res){
});

//signout
router.get("/signout", function(req, res){
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	   return next();
	   }
	res.redirect("/signin");
}

module.exports=router;
