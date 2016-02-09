var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/user.js');

/* GET /Users listing. */
router.get('/Users', function(req, res) {
  User.find(function (err, Users) {
    if (err) res.send(err);
    res.json(Users);
  });
});

/* POST /Users */
router.post('/Users', function(req, res) {
	 var errorMsg;
	 
	 if (isBlank(req.body.username)) {
		errorMsg = 'username mandatory and non empty';
	 } else if(isBlank(req.body.password)) {
		errorMsg = 'password mandatory and non empty';
	 }else if(isBlank(req.body.role)) {
		errorMsg = 'role mandatory and non empty';
	 }
		
	 if (errorMsg) {
		 res.status(400).send(errorMsg);
		 return 
	 }

        var user = new User();      // create a new instance of the Bear model
        user.username = req.body.username;  // set the bears name (comes from the request)
		user.password = req.body.password; 
		user.role = req.body.role; 
        user.save(function(err) {
            if (err) {
				res.status(500)
                res.send(err);
			}
            res.status(201).end();
			// send url back 	
        });
   
});

router.get('/Users/:id', function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
  User.findById(req.params.id, function (err, post) {
    if (err) {
		res.status(500).send(err);
	}
	if (post == null) {
		res.status(404).end();
	} else {
		res.json(post);
	}
    
  });
});


router.put('/Users/:id', function(req, res) {
	 var errorMsg;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
	 if(isBlank(req.body.password)) {
		errorMsg = 'password mandatory and non empty';
	 }
	 
	 if(isBlank(req.body.role)) {
		errorMsg = 'role mandatory and non empty';
	 }

	 //delete req.body.username;
		
	 if (errorMsg) {
		 res.status(400).send(errorMsg);
		 return 
	 }	
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
     if (err) {
		res.status(500).send(err);
	}
	if (post == null) {
		res.status(404).send('user with id does not exist');
	} else {
		res.status(204).end();
	}
  });
});


router.delete('/Users/:id', function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
  User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) {
		return res.status(500).send(err);
	}
	if(!post) {
	   return res.status(404).send('user does not exist');
	}
	res.status(204).end();
  });
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = router;