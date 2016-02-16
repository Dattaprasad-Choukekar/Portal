var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');
var async = require('async');

var studentDipslayFields = {
  path: 'students',
  select: 'firstName lastName'
};

var teacherDipslayFields = {
  path: 'teacher',
  select: 'firstName lastName'
};

router.get('/Courses',  function(req, res) {
 console.log(req.body);
  models.Course.find().populate(studentDipslayFields).populate(teacherDipslayFields)
  .exec(function (err, classes) {
    if (err) {
		 console.log(err);
		 res.status(500).send(errorMsg);
	} 
    res.json(classes);
  }); 

});

function authoriseIsAdmin(req, res, next) {
	 console.log(req.user.role == 'AD');
	if (!(req.user.role == 'AD')) {
		 res.status(400).send("Unauthorised");
	} else {
		next();
	}
}

router.post('/Courses', authoriseIsAdmin, function(req, res) {
	 var errorMsg;
	 if (isBlank(req.body.name)) {
		errorMsg = 'name mandatory and empty';
	 } else  if (isBlank(req.body.teacher)) {
		errorMsg = 'teacher mandatory and non empty';
	 } else if (!isBlank(req.body.teacher) && !mongoose.Types.ObjectId.isValid(req.body.teacher)) {
		errorMsg = 'teacher id not valid';
	}
 
	 if (errorMsg) {
		 console.log(errorMsg);
		 res.status(400).send(errorMsg);
		 return 
	 }

     var course = new models.Course(req.body);      // create a new instance of the Bear model
     course.save(function(err, savedObj) {
        if (err) {
			console.log(err);
			res.status(500)
            return res.send(err);
		} 
		res.sendStatus(201);	
	 });
});

router.get('/Courses/:id', function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
	models.Course.findById(req.params.id).populate(studentDipslayFields).populate(teacherDipslayFields)
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


router.put('/Courses/:id', authoriseIsAdmin, function(req, res) {
	
	var errorMsg;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	} else if (isBlank(req.body.teacher)) {
		errorMsg = 'teacher mandatory and non empty';
	 } else {
		if (!mongoose.Types.ObjectId.isValid(req.body.teacher)) {
			console.log(req.body.teacher);
			errorMsg = 'teacher id not valid';
		}
	 }
	 if (errorMsg) {
		 console.log(errorMsg);
		 res.status(400).send(errorMsg);
		 return 
	 }
	 
	models.Course.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		if (err) {
			return res.status(500).send(err);
		}
		if (post == null) {
			return res.status(500).send('course with id does not exist');
		}
		res.sendStatus(204);
	});

});


router.delete('/Courses/:id',authoriseIsAdmin, function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
   models.Course.findOneAndRemove({'_id' : req.params.id}, req.body, function (err, data) {
    if (err) {
		return res.status(500).send(err);
	}
	if(!data) {
	   return res.status(404).send('course does not exist');
	}
	res.status(204).end();
  });
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = router;