var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');
var async = require('async');


router.get('/Courses/:id/messages',  function(req, res) {

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
			
			models.Message.find({}).populate('ownerId').lean().exec(
				function(err, data){
					if (err) {
						console.log(err);
						return res.status(500).send(err);
					}
					
					for (var val in data) {
						if (data[val].ownerId._id.toString() == req.user._id.toString()) {
							data[val]['editable'] = true;
						}
					}
					res.json(data);
				}
			);
		}
	);

});



router.post('/Courses/:id/messages', function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('Course id not valid!' + req.params.id);

	} 
	if (!req.body.content || isBlank(req.body.content)) {
		return res.status(400).send('content is mandatory');
	}
	
	if (req.body.ownerId && !mongoose.Types.ObjectId.isValid(req.body.ownerId)) {
			return res.status(400).send('ownerId not valid!' + req.body.ownerId);
		
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
			
			var message = new models.Message(req.body);
			if (!message.ownerId) {
				message.ownerId = req.user._id;
			}
			message.save(function (err, data) {
				if (err) {
					console.log(err);
					return res.status(500).send('Unable to save message');
				}
				res.sendStatus(201);
			});
		}
	);
	
});




router.get('/Courses/:id/messages/:messageId', function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('Course id not valid!' + req.params.id);
	} 
	
	if (!mongoose.Types.ObjectId.isValid(req.params.messageId)) {
		return res.status(400).send('message id not valid!' + req.params.messageId);
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
			
			models.Message.findById(req.params.messageId, function (err, found) {
				if (err) {
					console.log(err);
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('message with id does not exist' + req.params.messageId);
				}
				
				res.json(found);

			});
		}
	);
});

router.delete('/Courses/:id/messages/:messageId', function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('Course id not valid!' + req.params.id);
	} 
	
	if (!mongoose.Types.ObjectId.isValid(req.params.messageId)) {
		return res.status(400).send('message id not valid!' + req.params.messageId);
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
			
			models.Message.findById(req.params.messageId).populate('ownerId').exec(function (err, found) {
				if (err) {
					console.log(err);	
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('message with id does not exist' + req.params.fileId);
				}
				
				// Teacher can delete all messages 
				// student can delete own messages
				if (req.user.role == 'ST' && found.ownerId._id.toString() != req.user._id.toString()) {
					return res.status(400).send('This message does not belong to requester');
				}
				found.remove(function (err, data) {
					if (err) {
						console.log(err);
						return res.status(500).send(err);
					}
					
					res.status(204).end();
				});
			});
	
		}
);
});

router.put('/Courses/:id/messages/:messageId', function(req, res) {
	var errorMsg = null;
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('Course id not valid!' + req.params.id);
	} 
	
	if (!mongoose.Types.ObjectId.isValid(req.params.messageId)) {
		return res.status(400).send('message id not valid!' + req.params.messageId);
	} 
	
	if (isBlank(req.body.content)) {
		return res.status(400).send('content is mandatory!');
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
			/*
			if (!req.body.ownerId) {
				req.body.ownerId = req.user._id;
			}*/
			
			models.Message.findById(req.params.messageId, function (err, found) {
				if (err) {
					console.log(err);	
					return res.status(500).send(err);
				}
				if (!found) {
					return res.status(500).send('message with id does not exist' + req.params.messageId);
				}
							
				// Teacher can update all messages 
				// student can update own messages
				if (req.user.role == 'ST' && found.ownerId.toString() != req.user._id.toString()) {
					return res.status(400).send('This message does not belong to requester');
				}
				models.Message.findByIdAndUpdate(req.params.messageId, req.body, function (err, found){
					if (err) {
						console.log(err);	
						return res.status(500).send(err);
					}
					if (!found) {
						return res.status(500).send('message with id does not exist' + req.params.messageId);
					}
					console.log(req.body);
					res.status(204).end();
				}
				);
				
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

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}



module.exports = router;