var express = require('express');
var authoriseUser = require('../config/authoriseUser.js');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (req.user.role == 'TR') {
	return res.redirect("/teacher");
  }else if (req.user.role == 'ST') {
	return res.redirect("/student");
  }else if (req.user.role == 'AD') {
	return res.redirect("/admin");
  }
  res.render('index', { title: 'Express' });
});

router.get('/admin', authoriseUser.checkIsAdmin, function(req, res, next) {
  res.render('admin', { title: 'Admin Page' });
});

router.get('/teacher', authoriseUser.checkIsAdminOrTeacher, function(req, res, next) {
  res.render('teacher', { title: 'Teacher Page' });
});


router.get('/student', function(req, res, next) {
  res.render('teacher', { title: 'Student Page' });
});




module.exports = router;
