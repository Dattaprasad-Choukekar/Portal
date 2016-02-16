var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');
var async = require('async');

var studentDipslayFields = {
  path: 'students',
  select: 'firstName lastName'
};


router.get('/Classes', function(req, res) {
  models.Class.find().populate(studentDipslayFields)
  .exec(function (err, classes) {
    if (err) {
		 console.log(err);
		 res.status(500).send(errorMsg);
	} 
    res.json(classes);
  }); 

});


router.post('/Classes', function(req, res) {
	 console.log(req.body);
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
	//	var identifiersArr = req.body.students.split(',');
		req.body.students = req.body.students;
	 } else {
		 req.body.students= [];
	 }	 

        var classVar = new models.Class(req.body);      // create a new instance of the Bear model
        classVar.save(function(err, savedObj) {
            if (err) {
				console.log(err);
				res.status(500)
                 return res.send(err);
			} else {
				if (res,req.body.students.length > 0) {
					updateStudentModelRef(req, res,req.body.students, savedObj );
				} else {
					res.sendStatus(201);
				}
			}		
			// send url back 	
        });
});

router.get('/Classes/:id', function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
  models.Class.findById(req.params.id).populate(studentDipslayFields)
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

	 if (!req.body.students) {
			req.body.students = [];
	 }else {
		console.log(req.body.students);
		//req.body.students = req.body.students.split(',');
		console.log(req.body.students);
	 } 
	 
	 async.series([one, two],
	function callback (err, results){
		if (err) { 
			console.log(err);
			return res.status(500).send(err);
		} 
		res.sendStatus(204);
	});
	 
	 // Remove classRef from students models 
		 // Remove classRef from students models 
	 function one(callback) {	 
	 console.log('qqqqqqqqqqq');
	 console.log(req.body.students);
	 
		models.Class.findById(req.params.id, function (err, data) {
			if (err) {
				console.log(err);
				return callback(err);
			}
			if (data == null) {
				return callback('class with id does not exist');
			} else {
				removeClassRefFromStudentModel(req, res, data.students,  data._id , callback);
			}
		});
	  
	 };
	 
	 
  function two(callback) { 
		models.Class.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
		if (err) {
			
			console.log(err);
		
			callback(err);
		}
		if (post == null) {
			callback('class with id does not exist');
		} else {
			console.log(post.students);
			console.log(post._id);
			updateStudentModelRef(req, res, req.body.students, post._id, callback);
			
		}
		});
  }	;
});


router.delete('/Classes/:id', function(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		res.status(400).send('id not valid');
		return;
	}
  models.Class.findOneAndRemove({'_id' : req.params.id}, req.body, function (err, data) {
    if (err) {
		return res.status(500).send(err);
	}
	if(!data) {
	   return res.status(404).send('class does not exist');
	}
	
	removeClassRefFromStudentModel(req, res, data.students,  data._id );
	res.status(204).end();
  });
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}


// TODO Ideally should be atomic
function updateStudentModelRef(req, res, studentIdsArr, classRefId, callback ) {
	models.Student.update({
    '_id': { $in: studentIdsArr}
 }, {  classRef : classRefId}, { multi: true }, function (err, raw) {
  if (err)  {
	  console.log('Error while updating classRef of student  model', err);
	  res.status(500).send(err);
  } else {
	  console.log('Updated students');
	   console.log(raw);
	   if (callback) {
		   callback();
	   } else {
		   res.status(201).end();
	   }
	  
  }

});
		
}

// TODO Ideally should be atomic
function removeClassRefFromStudentModel(req, res, studentIdsArr, classRefId, callback ) {
	models.Student.update({
    '_id': { $in: studentIdsArr}, 'classRef' : classRefId
 }, {  classRef : null}, { multi: true }, function (err, raw) {
  if (err)  {
	  console.log('Error while updating classRef of student  model', err);
	  if (callback) {
		  callback(err);
	  }else {
		  res.status(500).send(err);
	  }

  } else {
	  console.log(raw);
	  if (!callback) {
		  res.status(204).end();
	  } else {
		  callback();
	  }
  }

});
		
}

module.exports = router;