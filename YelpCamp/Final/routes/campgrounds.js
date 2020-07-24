var express = require('express');
var router = express.Router();
var Campground = require('../models/campground.js');
var Comment = require('../models/comments.js');
var middleware = require('../middleware/index.js');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
};

var geocoder = NodeGeocoder(options);

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'ashleylmy',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//index route
router.get('/', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log('something wrong');
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    });
});

//New form for campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, upload.single('image'), function (req, res) {
    // get data from form and add to campgrounds array
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            // add image's public_id to campground object
            req.body.campground.imageId = result.public_id;
            // add author to campground
            req.body.campground.author = {
                id: req.user._id,
                username: req.user.username,
            };
            Campground.create(req.body.campground, function (err, newlyCreated) {
                if (err) {
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    console.log(newlyCreated);
                    res.redirect('/campgrounds');
                }
            });
        });
    });
});
        // Create a new campground and save to DB
        

// SHOW - shows more info about one campground
router.get('/:id', function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function (err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
				console.log(foundCampground);
                //render show template with that campground
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

//Edit campground form
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//updated campground
router.put('/:id', upload.single('image'),  function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        //find and update the correct campground
        //redirect to campground
        Campground.findById(req.params.id, async function (err, campground) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('back');
            } else {
				if (req.file) {
				  try {
					  await cloudinary.v2.uploader.destroy(campground.imageId);
					  var result = await cloudinary.v2.uploader.upload(req.file.path);
					  campground.imageId = result.public_id;
					  campground.image = result.secure_url;
				  } catch(err) {
					  req.flash("error", err.message);
					  return res.redirect("back");
				  }
				}
				campground.name = req.body.name;
				campground.description = req.body.description;
				campground.price=req.body.price;
				campground.lat = data[0].latitude;
				campground.lng = data[0].longitude;
				campground.location = data[0].formattedAddress;
				console.log(campground);
				campground.save();
				req.flash('success', 'Successfully Updated!');
				res.redirect('/campgrounds/' + campground._id);
            }
        });
    });
});

//delete campground
router.delete('/:id', middleware.checkCampgroundOwnership, async function (req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", "campground doesn't exist");
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

module.exports = router;