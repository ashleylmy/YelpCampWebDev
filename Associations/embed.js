var mongoose= require("mongoose")

//app config
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/embed', { useNewUrlParser: true });

//USER--email name
var userSchema= new mongoose.Schema({
	name: String,
	email: String
})

var User=mongoose.model("User", userSchema);

//POST - title, content

var postSchema= new mongoose.Schema({
	title: String,
	content: String
})

var Post= mongoose.model("Post", postSchema);

// var newUser = new User({
//     email: "hermione@hogwarts.edu",
//     name: "Hermione Granger"
// });

// newUser.save(function(err, user){
//   if(err){
//       console.log(err);
//   } else {
//       console.log(user);
//   }
// });

var newPost = new Post({
    title: "Reflections on Apples",
    content: "They are delicious"
});

newPost.save(function(err, post){
    if(err){
        console.log(err);
    } else {
        console.log(post);
    }
});
