var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');
var models = require('../models/models.js');
var authenticateUser = require('../config/authoriseUser.js');
var async = require('async');


router.get('/Broadcasts/',  function(req, res) {
	console.log(req.user);
	if (req.user.role == 'ST') {
		models.Student.findById(req.user._id, function(err, student) {
			if (err) {
					console.log(err);
					return res.status(500).send(err);
			}
			if (student.classRef) {
				models.Broadcast.find({classes : {$in : [student.classRef] }}).populate('ownerId').populate('classes').exec(
				function (err, broadcasts) {
					if (err) {
						console.log(err);
						return res.status(500).send(err);
					}
						console.log(broadcasts);
						return res.json(broadcasts);
					}
				);						
			} else {
				return res.json({});
			}
		});
	}
	
	if (req.user.role == 'AD' || req.user.role == 'TR') {
		models.Broadcast.find().populate('ownerId').populate('classes').exec(
			function (err, broadcasts) {
				if (err) {
					console.log(err);
					return res.status(500).send(err);
				}
				res.json(broadcasts);
			}
		);
	}
});

router.get('/Broadcasts/:id',  function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('broadcast id not valid!' + req.params.id);
	} 
	models.Broadcast.find({_id:req.params.id}).populate('ownerId').populate('classes').exec(
		function (err, broadcasts) {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			if (broadcasts.length == 0) {
				return res.status(404).send('broadcast does not exists!' + req.params.id);
			}
			res.json(broadcasts);
		}
	);
});

router.post('/Broadcasts', authenticateUser.checkIsAdmin, function(req, res) {
		
	if (!req.body.content || isBlank(req.body.content)) {
		return res.status(400).send('content is mandatory!' + req.body.content);
	}
	
	if (!req.body.title || isBlank(req.body.title)) {
		return res.status(400).send('title is mandatory!' + req.body.title);
	}
	
	req.body.ownerId = req.user._id;
	var broadcast = new models.Broadcast(req.body);
	
	broadcast.save(function (err, data) {
		if (err) {
			console.log(err);
			return res.status(500).send('Unable to save broadcast');
		}
		res.sendStatus(201);
	});	
});

router.put('/Broadcasts/:id', authenticateUser.checkIsAdmin, function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('broadcast id not valid!' + req.params.id);
	} 
		
	if (!req.body.content || isBlank(req.body.content)) {
		return res.status(400).send('content is mandatory!' + req.body.content);
	}
	
	if (!req.body.title || isBlank(req.body.title)) {
		return res.status(400).send('title is mandatory!' + req.body.title);
	}
	
	// reset ownerId if set by user
	req.body.ownerId = req.user.id;
	var broadcast = new models.Broadcast(req.body);
	
	models.Broadcast.findByIdAndUpdate(req.params.id, req.body,
		function (err, broadcast) {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			if (!broadcast) {
				return res.status(404).send('broadcast does not exists!' + req.params.id);
			}
			res.sendStatus(204);
		}
	);

});

router.delete('/Broadcasts/:id',  authenticateUser.checkIsAdmin,function(req, res) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).send('broadcast id not valid!' + req.params.id);
	} 
	models.Broadcast.find({_id:req.params.id}).populate('ownerId').populate('classes').exec(
		function (err, broadcasts) {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
			if (broadcasts.length == 0) {
				return res.status(404).send('broadcast does not exists!' + req.params.id);
			}
			
			broadcasts[0].remove(
				function(err, broadcasts) {
					if (err) return res.status(500).send(err);
					res.status(204).send();
				}
			);
		}
	);
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}



module.exports = router;