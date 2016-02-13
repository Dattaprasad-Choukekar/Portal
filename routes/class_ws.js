var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');

var userDipslayFields = {
  path: 'students',
  select: 'firstName lastName'
};


router.get('/Classes', function(req, res) {
  models.Class.find().populate(userDipslayFields)
  .exec(function (err, classes) {
    if (err) {
		 console.log(err);
		 res.status(500).send(errorMsg);
	} 
    res.json(classes);
  }); 

});


router.post('/Classes', function(req, res) {
	 var errorMsg;
	 if (isBlank(req.body.name)) {
		errorMsg = 'name mandatory and non empty';
	 }
	 if (errorMsg) {
		 console.log(errorMsg);
		 res.status(400).send(errorMsg);
		 return 
	 }
	 if (!isBlank(req.body.students)) {
		 //id1,id2    -> ['id1', 'id2']
		var identifiersArr = req.body.students.split(',');
		req.body.students = identifiersArr;
	 } else {
		 req.body.students= [];
	 }	 

        var classVar = new models.Class(req.body);      // create a new instance of the Bear model
        classVar.save(function(err) {
            if (err) {
				console.log(err);
				res.status(500)
                res.send(err);
			}
            res.status(201).end();
			// send url back 	
        });
});

router.get('/Classes/:id', function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
  models.Class.findById(req.params.id).populate(userDipslayFields)
  .exec(function (err, post) {
    if (err) {
		console.log(err);
		res.status(500).send(err);
	}
	if (post == null) {
		res.status(404).end();
	} else {
		res.json(post);
	}
    
  });
});


router.put('/Classes/:id', function(req, res) {
	 var errorMsg;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}

	 //delete req.body.username;
		
	 if (errorMsg) {
		 console.log(errorMsg);
		 res.status(400).send(errorMsg);
		 return 
	 }	
	 if (!isBlank(req.body.students)) {
		 //id1,id2    -> ['id1', 'id2']
		var identifiersArr = req.body.students.split(',');
		req.body.students = identifiersArr;
	 } else {
		 req.body.students = [];
	 }
  models.Class.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) {
		console.log(err);
		res.status(500).send(err);
	}
	if (post == null) {
		res.status(404).send('class with id does not exist');
	} else {
		res.status(204).end();
	}
  });
});


router.delete('/Classes/:id', function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
  models.Class.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) {
		return res.status(500).send(err);
	}
	if(!post) {
	   return res.status(404).send('class does not exist');
	}
	res.status(204).end();
  });
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = router;