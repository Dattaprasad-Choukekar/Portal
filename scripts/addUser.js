
var mongoose = require('mongoose');
var async = require('async');
mongoose.connect('mongodb://localhost/portal_db');

var models    = require('../models/models');


var mgdb= require('mongodb').Db;
    var Server = require('mongodb').Server;

var db = new mgdb('portal_db', new Server('localhost', 27017));
db.open(function(err, db) {
  db.dropDatabase(function(err, result) {
    console.log('db dropped');
   adduser();
  });
});

function adduser() {
	var newUser            = new models.User();
 // set the user's local credentials
newUser.username = 'admin';
newUser.password = 'admin';
newUser.role = 'AD';
newUser.firstName = 'Admin Name';
newUser.lastName = 'Admin Last Name';
newUser.email = 'Email';

// save the user
newUser.save(function(err) {
  if (err) {
   console.log(err);
   throw err;
  }
   console.log('Added user '  + newUser.username + ':' + newUser.password);
   //process.exit();
});



var newUser            = new models.User();
 // set the user's local credentials
newUser.username = 'std1';
newUser.password = 'std1';
newUser.role = 'ST';
newUser.firstName = 'std1 Name';
newUser.lastName = 'std1 Name';
newUser.email = 'std@dom.com';

// save the user
newUser.save(function(err) {
  if (err) {
   console.log(err);
   throw err;
  }
 //  console.log('Added user '  + newUser.username + ':' + newUser.password);
   //
   
   var newUser            = new models.User();
 // set the user's local credentials
newUser.username = 'std2';
newUser.password = 'std2';
newUser.role = 'ST';
newUser.firstName = 'std2 Name';
newUser.lastName = 'std1 Name';
newUser.email = 'std2@dom.com';

// save the user
newUser.save(function(err) {
  if (err) {
   console.log(err);
   throw err;
  }
  addClass();
  });
   
});
};



function addClass() {
	 models.User.find({'role': 'ST'}, function(err, resad){
     console.log(err);
	 console.log('into mongoose findone' );
	 console.log(resad);
	 
	 
	 
	    var newClass  = new models.Class();
		// set the user's local credentials
		newClass.name = 'cl1';
		newClass.students.push(resad[0]._id);
		newClass.students.push(resad[1]._id);

		// save the user
		newClass.save(function(err) {
				if (err) {
					console.log(err);
				throw err;
			}
				console.log('Added class ');
				
	
				
			models.Class.findOne({name: 'cl1'})
			.populate('students')
			.exec(function(err, post) {
			console.log(post);
			process.exit();
			});

		});	
});



};





