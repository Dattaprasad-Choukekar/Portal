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
	if (req.isAuthenticated())
        return next();
    res.sendStatus(401);
});

app.use('/', function (req, res, next) {
	if (req.isAuthenticated()){
		res.locals.req = req;
		res.locals.res = res;
        return next();
	}
    res.redirect('/login');
});
};
