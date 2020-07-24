var mongoose = require("mongoose");
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/cat_app', { useNewUrlParser: true });

var catSchema= new mongoose.Schema({
	name:String,
	age: Number
})

var Cat= mongoose.model("Cat", catSchema);

//add new cat

// var george = new Cat({
// 	name:"George",
// 	age:11
// });

// george.save(function(err, cat){
// 	if(err){
// 		console.log("something went wrong");
// 	}else{
// 		console.log("saved new cat");
// 		console.log((cat));
// 	}
// });
Cat.create({
	name:"GG",
	age:4
})

Cat.find({}, function(err, cats){
	if(err){
		console.log("error")
	}else{
		console.log(err);
		console.log(cats);
}
})
