module.exports = function(app, passport) {
app.get('/login', function(req, res) {
		console.log(req.flash('loginMessage'));
	res.render('login', { message: req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', 
        failureRedirect : '/login', 
        failureFlash : true 
}));

app.post('/login', function(req, res) {
		console.log('qqqq');
});
app.get('/logout', function(req, res) {
		req.logout();
        res.redirect('/');
});

app.use('/api/*', function (req, res, next) {
	if (req.isAuthenticated()) {
		 return next();
	}
	// Temp solution
	// if session cookie not found try basic auth
	passport.authenticate('basic', function(err, user, info) {	 
    if (err) { 
		console.log(err);
		return res.status(500).send(err);
	}
    // Redirect if it fails
	if (!user) { return res.sendStatus(401); }
	req.user = user;
	next();
	})(req, res, next);
	
});

app.use('/', function (req, res, next) {
	if (req.url.indexOf('/api/') > -1) {
		 console.log('Allowing ws req');
		 return next();
	}
	if (req.isAuthenticated()){
		res.locals.req = req;
		res.locals.res = res;
        return next();
	}
    res.redirect('/login');
});
};
