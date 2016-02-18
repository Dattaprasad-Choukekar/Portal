var authorize = {};

authorize.authoriseIsAdmin = function(req, res, next) {
	 console.log(req.user.role == 'AD');
	if (!(req.user.role == 'AD')) {
		 res.status(400).send("Unauthorised");
	} else {
		next();
	}
};


module.exports = authorize;