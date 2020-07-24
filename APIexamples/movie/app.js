var express=require("express");
var axios= require("axios");
var app=express();
var bodyParser=require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
	res.render("main");
})

app.get("/result", function(req, res){
	var query=req.query.keyword;
	axios.get('http://www.omdbapi.com/?s='+query+'&apikey=thewdb')
	.then(function(response){
	if(response.status==200){
		var results=response.data;
		res.render("result", {results: results});
	}
  })
  .catch(function (error) {
    // handle error
    console.log("something went wrong");
  });
});

app.listen(3000, function(){
	console.log("Movie app is ready")
})