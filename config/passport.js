// config/passport.js

var LocalStrategy   = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var models            = require('../models/models');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        models.User.findById(id, function(err, user) {
            done(err, user);
        });
    });
	
	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
		authenticate(req, username, password, done);

    }));
	
	
     
	 function authenticate(req, username, password, done) {
		models.User.findOne({ 'username' :  username }).select('password')
		.exec(function(err, user) {
			console.log(err);
			// if there are any errors, return the error before anything else
            if (err) {
                return done(err);
			}
            // if no user is found, return the message
            if (!user){
				
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
			}
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user
            return done(null, user);
        });
	 };
	 
	passport.use(new BasicStrategy(
		function(username, password, done) {
		models.User.findOne({ 'username' :  username }).select('password username firstName lastName role sex')
		.exec( function(err, user) {
			console.log(err);
			// if there are any errors, return the error before anything else
            if (err) {
                return done(err);
			}
            // if no user is found, return the message
            if (!user){
				
                return done(null, false); // req.flash is the way to set flashdata using connect-flash
			}
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, user);
        });
		}
	));

};