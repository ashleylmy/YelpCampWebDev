var express=require("express"),
	expressSanitizer=require("express-sanitizer"),
	app=express(),
	bodyParser = require("body-parser"),
	mongoose= require("mongoose"),
	methodOverride= require("method-override")

//app config
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose/model config
let blogSchema= new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	create: {type: Date, default: Date.now()}
});

let Blog = mongoose.model("Blog", blogSchema);

//RESTFul routes

//index route
app.get("/", function(req, res){
	res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("something is wrong");
		}else{
			res.render("index", {blogs: blogs});
		}
	})
});

//new route
app.get("/blogs/new", function(req, res){
	res.render("new");
})


//create route
app.post("/blogs", function(req, res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	var newBlog= req.body.blog;
	Blog.create(newBlog, function(err, blogs){
		if(err){
			console.log("error");
		}else{
			console.log("add new blog");
			res.redirect("/blogs");
		}
	})
});

//show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			res.redirect("/blogs")
		}else{
			
			res.render("show", {blog: blog});
		}
		});
});

//edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		}else{
			console.log(blog);
			res.render("edit", {blog: blog});
		}
});
});

//update route
app.put("/blogs/:id", function(req, res){
	console.log(req.params);
	req.body.blog.body=req.sanitize(req.body.blog.body);
 	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})

//delete route
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/blogs");
		}
	})
})

app.listen(3000, function(){
	console.log("server connected");
});
