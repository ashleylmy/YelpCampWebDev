var express=require("express");
var app=express();
var bodyParser=require("body-parser");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
var friends=["lisa", "lily", "lucy", "linda", "lindsay"];

app.get("/", function(req, res){
	res.render("home");
});

app.post("/addfriend", function(req, res){
	friends.push(req.body.name);
	res.redirect("/friends");
});

app.get("/friends", function(res, res){
	res.render("friends", {friends:friends});
	});

app.listen(3000, function(){
	console.log("server is ready")
})