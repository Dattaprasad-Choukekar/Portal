var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

router.get('/admin', function(req, res, next) {
  res.render('admin', { title: 'Admin Page' });
});

router.get('/teacher', function(req, res, next) {
  res.render('teacher', { title: 'Teacher Page' });
});




module.exports = router;
