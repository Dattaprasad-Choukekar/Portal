
var mongoose = require('mongoose');
var async = require('async');
mongoose.connect('mongodb://localhost/portal_db');

var models    = require('../models/models');
var classRef = {};
var teacherId = null;
var classId = null;
async.series([deleteDB, addAdminUser,addTeacher, addStudents, addClass , addCourses],

function callback (err, results){
	if (err) { 
		console.log('Failure!');
		console.log(err);
    } else{
		console.log('Success!');
		process.exit(0);
	}
});



function deleteDB(callback) {
	var mgdb= require('mongodb').Db;
	var Server = require('mongodb').Server;

	var db = new mgdb('portal_db', new Server('localhost', 27017));
	db.open(function(err, db) {
		if(err)  {
			console.log('db error');
			callback(err);
		}
		db.dropDatabase(function(err, result) {
			if(err) callback(err);
			console.log('db dropped');
			callback(null);
	});
});
};
/*
function addClass(callback) {
	var newClass = new models.Class();
	newClass.name = 'cl1';
	classRef = newClass;
	// save the user
	newClass.save(function(err) {
	  if (err) {
	   console.log(err);
	   callback(err);
	  }
	   console.log('Added class ');
	   callback(null);
	}
);
};

*/

function addAdminUser(callback) {
	var newUser = new models.User();
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
	   callback(err);
	  }
	   console.log('Added user '  + newUser.username + ':' + newUser.password);
	   callback(null);
	}
);
};


function addTeacher(callback) {
	var teacherArr = [];
	
	for(var i=0; i<3;i++) {
		var newTeacher = new models.Teacher();
		newTeacher.username = 'tchr' + i;
		newTeacher.password = 'tchr' + i;
		newTeacher.role = 'TR';
		newTeacher.firstName = 'Teacher ' + i;
		newTeacher.lastName = 'Teacher ' + i;
		newTeacher.email = 'Email';
		teacherArr.push(newTeacher);
	}
	
	async.map(teacherArr, function(newTeacher, callback){
		newTeacher.save(
			function saveTeacher(err, newTeacher) {
				if (err) {
					console.log(err);
					callback(err);
				}
				teacherId = newTeacher._id;
				console.log('Added Teacher '  + newTeacher.username);
				callback();
			}
		);
	
	}, function(err, results){
		if (err) callback(err);
		callback();
	});

};


function addStudents(callback) {
	var usersArr = [];
	
	for (var i=0; i<10; i++) {
		var newUser = new models.Student();
		// set the user's local credentials
		newUser.username = 'std' + i;
		newUser.password = 'std'+ i;
		newUser.role = 'ST';
		newUser.firstName = 'std'+ i+' Name';
		newUser.lastName = 'std'+ i+' Name';
		newUser.email = 'std@dom.com';
		//newUser.classRef = classRef;

		// save the user
		//newUser.save(saveUserFunc);
		usersArr.push(newUser);
	}
	
	async.eachSeries(usersArr, function iterator(student, done) {
		
		student.save( function (err) {
		if (err) {
			done(err);
		} else {
			console.log('Added student ' + student.username);
			done();
		}
	});

	}, function done(err) {
		if (err)  callback(err);
		callback();
	});
	
};

function addClass(callback) {

	models.Student.find({},function fun(err, data){
	var studentIdArr = [];
			
	for (var index in data) {
		//console.log(student);
		studentIdArr.push(data[index]._id);
	}
	var newClass = new models.Class();
	newClass.name = 'cl1';
	studentIdArr.splice(5,5);
	newClass.students = studentIdArr;
	newClass.save(function(err, classVar) {
		  if (err) {
		   console.log(err);
		   callback(err);
		  }
		   classId = classVar._id;
		   console.log('Added class ' +  classVar.name);
		  models.Student.update({'_id': { $in: studentIdArr} }, 
		  {  classRef : classVar._id}, { multi: true }, function (err, raw) {
			if (err)  {
				console.log('Error while updating classRef of student  model', err);
				callback(err);
			} else {
				console.log('Updated students');
				console.log(raw);
				callback();
			}

		});
		   
		  
		});
		});
		

	};



function addCourses(callback) {
		
		var newCourse = new models.Course();
		newCourse.name = 'crse1';
		newCourse.teacher = teacherId;
		newCourse.classes = [classId];
		// save the user
		newCourse.save(function(err, classVar) {
			if (err) {
				console.log(err);
				return callback(err);
			}
			console.log('Added Course ');
			callback();
		});

};
