var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment   = require("./models/comments.js");


var seeds = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
		price: "10",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
		price: "155",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
	   author:{
		id : "588c2e092403d111454fff71",
		username: "Jill"
	}
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
		price: "57",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
];

async function seedDB(){
    try {
        await Campground.remove({});
        console.log('Campgrounds removed');
        await Comment.remove({});
        console.log('Comments removed');

        for(const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log('Campground created');
            let comment = await Comment.create(
                {
                    text: 'This place is great, but I wish there was internet',
                    author: {
						id : "599c2e092403d111454fff76",
            			username: 'Homer'
					}
                }
            )
            console.log('Comment created');
            campground.comments.push(comment);
            campground.save();
            console.log('Comment added to campground');
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports= seedDB;