var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
  res.render('users', { title: 'Manage Users Page' });
});

module.exports = router;
