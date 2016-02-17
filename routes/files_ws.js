var express = require('express');
var fs = require("fs");

var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');
var async = require('async');

var multer = require('multer');
var uploading = multer({
  dest: __dirname + '\\..\\uploads\\',
});

router.get('/Courses/:id/files',  function(req, res) {

	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		if (req.file) {
			deleteFile(req.file.path);
		}
		return res.status(400).send('Course id not valid!' + req.params.id);
	} 
	models.Course.find({_id:req.params.id}).exec(
		function (err, data) {
			if (err) {
				return res.status(500).send(err);
			}
			var errorMsg = "";
			if (data.length == 0) {
				errorMsg= "course with id " + req.params.id + "does not exist";
			}

			if (errorMsg) {
				 console.log(errorMsg);
				 res.status(400).send(errorMsg);
				 return 
			}
			
			models.File.find({}, function(err, data){
				if (err) {
					return res.status(500).send(err);
				}
				res.json(data);
			
			});
		}
	);

});



router.post('/Courses/:id/files', uploading.single('file'), function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		if (req.file) {
			deleteFile(req.file.path);
		}
		return res.status(400).send('Course id not valid!' + req.params.id);

	} 
	if (!req.file) {
		return res.status(400).send('file is mandatory');
	}
	
	models.Course.find({_id:req.params.id}).exec(
		function (err, data) {
			if (err) {
				
				if (req.file) deleteFile(req.file.path);
				return res.status(500).send(err);
			}
			if (data.length == 0) {
				errorMsg= "course with id " + req.params.id + "does not exist";
			}
			
			if (!errorMsg && !req.file) {
				errorMsg= "file is mandatory ";
			}
			if (errorMsg) {
				if (req.file) deleteFile(req.file.path);
				 console.log(errorMsg);
				 res.status(400).send(errorMsg);
				 return 
			}
			
			var file = new models.File(req.file);
			file.save(function (err, data) {
				if (err) {
					if (req.file) deleteFile(req.file.path);
					return res.status(500).send('Unable to save files');
				}
				console.log(file);
				res.sendStatus(204);
			});
		}
	);
	
});


router.delete('/Courses/:id/files/:fileId', function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('Course id not valid!' + req.params.id);
	} 
	
	if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
		return res.status(400).send('file id not valid!' + req.params.fileId);
	} 

	models.Course.find({_id:req.params.id}).exec(
		function (err, data) {
			if (err) {
				return res.status(500).send(err);
			}
			if (data.length == 0) {
				errorMsg= "course with id " + req.params.id + "does not exist";
			}
			if (errorMsg) {
				 console.log(errorMsg);
				 res.status(400).send(errorMsg);
				 return 
			}	
			models.File.findById(req.params.fileId, function (err, found) {
				if (err) {
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('file with id does not exist' + req.params.fileId);
				}
				
				found.remove(function (err, data) {
					if (err) {
						return res.status(500).send(err);
					}
					res.status(204).end();
				});
			});
		}
	);
});

router.get('/Courses/:id/files/:fileId', function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('Course id not valid!' + req.params.id);
	} 
	
	if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
		return res.status(400).send('file id not valid!' + req.params.fileId);
	} 

	models.Course.find({_id:req.params.id}).exec(
		function (err, data) {
			if (err) {
				return res.status(500).send(err);
			}
			if (data.length == 0) {
				errorMsg= "course with id " + req.params.id + "does not exist";
			}
			if (errorMsg) {
				 console.log(errorMsg);
				 res.status(400).send(errorMsg);
				 return 
			}	
			models.File.findById(req.params.fileId, function (err, found) {
				if (err) {
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('file with id does not exist' + req.params.fileId);
				}
				return res.json(found);
			});
		}
	);
});

function deleteFile(fileName) {
	fs.unlink(fileName, function(err) {
		if (err) {
			return console.error(err);
		}
		return console.log("File deleted successfully!" + fileName);
	});
};



module.exports = router;