const express = require('express');
const router = express.Router();
var passport = require('passport');
var Post = require('../models/post.js');

var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

// GET HOME PAGE. 
router.get('/', function (req, res, next) {
    var productChunks = [];
            
            Post.find({}).sort({ _id: -1 }).then((result) => {
                if(result){
                    for (var i = 0; i < result.length; i++) {
                    productChunks.push([result[i]]);
                    }
                }
                res.render('main/index',{ 
                    posts: productChunks,
                    csrfToken: req.csrfToken()    
        });
     });
});


// GET BLOG CONTENT PAGE
// router.get('/:id', function (req, res, next) {

//         var productChunks = [];
//             var id = req.params.id;
//             //console.log("Post is " +_id);
//             Post.find({'_id':id}).then((result) => {
//                 if(result){
//                     for (var i = 0; i < result.length; i++) {
//                     productChunks.push([result[i]]);
//                     }
//                 }
//                 console.log(productChunks);
//                 res.render('main/content',{ 
//                     posts: productChunks
//             });   
//         });     

// });



//GET BLOG CONTENT PAGE
router.get('/content/:id', function (req, res, next) {

        var productChunks = [];
            var id = req.params.id;
            //console.log("Post is " +_id);
            Post.find({'_id':id}).then((result) => {
                if(result){
                    for (var i = 0; i < result.length; i++) {
                    productChunks.push([result[i]]);
                    }
                }
                console.log(productChunks);
                res.render('main/content',{ 
                    posts: productChunks
            });   
        });     

});


//ADMINDASHBOARD
router.get('/dashboard', isLoggedIn, function (req, res, next) {
    console.log("GET ROUTE /dashboard")
            var productChunks = [];
            Post.find({}).then((result) => {
                if(result){
                    for (var i = 0; i < result.length; i++) {
                    productChunks.push([result[i]]);
                    }
                }
                res.render('admin/dashboard',{ 
                    posts: productChunks,
                    csrfToken: req.csrfToken()
              });     
            });
    
});



//SUBMIT BLOG POST   
router.post('/submit-blog-post', isLoggedIn,function(req,res) {
          console.log("About to submit blog post ");
          console.log("About to save to the database");
          var post = new Post({ 
                title : req.body.title,
                body : req.body.body,
                tags: req.body.tags,
                url: req.body.url,
                author: req.body.author
            });
          console.log(post);

            post.save()
            .then(data => {
                    console.log('Saving post to database');
                    console.log(data);
                    console.log('Post saved successfully');
                    }).catch(err => {
                    res.status(500).send({
                    message: err.message,
                    csrfToken: req.csrfToken()
            })
                })
                .catch((uploaderror)=>{
                  console.log(uploaderror);
                });
      
        //res.redirect('/dashboard',{
              res.render('admin/dashboard',{csrfToken: req.csrfToken()

        });
    });

//DELETE BLOG POST
router.get("/delete/:id",isLoggedIn, function(req, res){
   //FIND AND DELETE GROUP
    console.log("Your id is " + req.params.id)
    Post
     .findByIdAndRemove(req.params.id)
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).end(); 
        }
        res.redirect("/dashboard");
        return res.status(204).end();

    })
    .catch(err => next(err));
});



//SIGN UP
router.get('/signup', function (req, res, next) {
        res.render('main/sign-up',{
            csrfToken: req.csrfToken()
        });
});

//DISPLAY SIGNUP
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/signup',
    failureFlash: true
    }), function (req, res, next) {
    console.log("Your email is "+req.body.email);
    console.log("Your email is "+req.body.password);
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/dashboard',{ csrfToken: req.csrfToken()})
    }
});


//GET REQUEST TO SIGN IN
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
        res.render('main/sign-in' ,{
            csrfToken: req.csrfToken()
        });
});


//POST TO SIGNIN
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else { 
        res.redirect('/dashboard');
    }
});



//ERROR PAGE
router.get('*', function(req, res, next) {
    res.render('main/error');
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}