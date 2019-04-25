const express = require('express');
const router = express.Router();
var passport = require('passport');


const hbs = require('hbs');

var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

const Controller = require('../controller/controller.js');

// GET HOME PAGE. 
router.get('/', function (req, res, next) {
        res.render('main/index',{
    });
});


// GET BLOG CONTENT PAGE
router.get('/content', function (req, res, next) {
        res.render('main/content',{
    });
});


//ADMINDASHBOARD
router.get('/dashboard', function (req, res, next) {
        res.render('admin/dashboard',{
    });
});



//SIGN IN
router.get('/signin', function (req, res, next) {
        res.render('main/sign-in',{
    });
});

//SIGN UP
router.get('/signup', function (req, res, next) {
        res.render('main/sign-up',{
    });
});

//DISPLAY SIGNUP
router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/signup',
    failureFlash: true
    }), function (req, res, next) {
        //
    console.log("Your email is "+req.body.email);
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('main/dashboard');
    }
});

//GET REQUEST TO SIGN IN
router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
        res.render('main/dashboard', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

//POST TO SIGNIN
router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/signin',
    failureFlash: true
}), function (req, res, next) {
    console.log("Your email is "+req.body.email);
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else { 
        res.redirect('/dashboard');
    }
});



//ERROR PAGE
router.get('*', Controller.error_page, function(req, res, next) {});

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