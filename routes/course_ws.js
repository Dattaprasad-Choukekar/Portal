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
 var filterParams = {};
 if (req.user.role == 'TR' || req.user.role == 'AD') {
	if (req.user.role == 'TR'){
		filterParams = { teacher : req.user._id};
	}
	  models.Course.find(filterParams).populate(teacherDipslayFields).populate('classes')
  .exec(function (err, classes) {
    if (err) {
		 console.log(err);
		 return res.status(500).send(errorMsg);
	} 
    return res.json(classes);
  }); 
 } else if (req.user.role == 'ST') {
	//filterParams = { students : { $in: [req.user._id] }};
	// TODO 
	
	models.Student.findById(req.user._id).
		exec(function (err, student) {
		if (err) {
			 console.log(err);
			 return  res.status(500).send(errorMsg);
		} 
		
		if (student.classRef ) {
			models.Course.find({ classes : { $in: [student.classRef] }}).populate(teacherDipslayFields).populate('classes')
			  .exec(function (err, classes) {
				if (err) {
					 console.log(err);
					res.status(500).send(errorMsg);
				} 
				console.log(classes);
				return res.json(classes);
			  }); 
		
		}else {
			return res.json({});
		}
	  }); 
 }

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
	}else if (req.body.classes) {
	     for (var id in req.body.classes) {
			 if (!mongoose.Types.ObjectId.isValid(req.body.classes[id])) {
				errorMsg = 'class id not valid';
				break;
			 }
		 }
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
	models.Course.findById(req.params.id).populate('classes').populate(teacherDipslayFields)
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
	
	var errorMsg = null;
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
	 if (!errorMsg && req.body.classes) {
	     for (var id in req.body.classes) {
			 if (!mongoose.Types.ObjectId.isValid(req.body.classes[id])) {
				errorMsg = 'class id not valid';
				break;
			 }
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