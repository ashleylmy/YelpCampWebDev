var express=require("express");
var app= express();
var animalSounds={
	pig: "Oink",
	cow: "Moo",
	dog: "Woof Woof"
	
}
app.get("/", function(req, res){
	res.send("hi there! welcome to my assignment");
});

app.get("/speak/:animal", function(req, res){
	var soundMaker=req.params.animal;
	res.send(animalSounds[soundMaker]);
});

app.get("/repeat/:message/:count", function(req, res){
	var msg=req.params.message;
	var counts= req.params.count;
	var output="";
	for(i=0; i<counts; i++){
		output+=msg+" ";
	}
	
	res.send(output);
});


app.get("*", function(req, res){
	res.send("404 sorry page not found");
});

app.listen(3000, function(){
	console.log("server started!");
});