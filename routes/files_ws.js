var express = require('express');
var fs = require("fs");

var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');
var async = require('async');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '\\..\\uploads\\');
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now() + '-'  + file.originalname );
  }
})

var uploading = multer({ storage: storage });

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
				console.log(err);
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
			
			models.File.find({'courseId' : mongoose.Types.ObjectId(req.params.id)}).populate('ownerId').lean().exec(
				function(err, data){
					if (err) {
						console.log(err);
						return res.status(500).send(err);
					}
					
					for (var val in data) {
						if (req.user.role == "ST") {
							if (data[val].ownerId._id.toString() == req.user._id.toString()) {
								data[val]['editable'] = true;
							} else {
								data[val]['editable'] = false;
							}
							
						} else {
							data[val]['editable'] = true;
						}
					}
					
					res.json(data);
				}
			);
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
				console.log(err);
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
			file.ownerId = req.user._id;
			file.courseId = req.params.id;
			file.save(function (err, data) {
				if (err) {
					console.log(err);
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
				console.log(err);
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
					console.log(err);	
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('file with id does not exist' + req.params.fileId);
				}
				
				found.remove(function (err, data) {
					if (err) {
						console.log(err);
						return res.status(500).send(err);
					}
					deleteFile(data.path);
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
				console.log(err);
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
					console.log(err);
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('file with id does not exist' + req.params.fileId);
				}

				 res.download(found.path, found.originalname);

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