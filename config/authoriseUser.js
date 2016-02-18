var authorize = {};

authorize.checkIsAdmin = function(req, res, next) {
	if (!(req.user.role == 'AD')) {
		 res.redirect("/");
	} else {
		next();
	}
};

authorize.checkIsAdminOrTeacher = function(req, res, next) {
	if ((req.user.role == 'AD') || (req.user.role == 'TR')) {
		 next();
	} else {
		res.redirect("/");
	}
};


module.exports = authorize;