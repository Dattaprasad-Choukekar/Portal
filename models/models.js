// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
var options = {discriminatorKey: 'kind'};
// define the schema for our user model
var userSchema = mongoose.Schema({ 
		username: {type: String,trim: true,unique: true,required: true},
		password: {type: String,required: true, select: false},
		role: {type: String, enum: ['AD', 'ST', 'TR'] , default: 'ST'},
		firstName : {type: String,required: true},
		lastName : {type: String,required: true},
		birthDate : Date,
		email: {type: String}, // Add validation
		sex : {type: String, enum: ['M', 'F', 'O'], default: 'M' },
		classRef: { type: mongoose.Schema.ObjectId, ref: 'Class'}	
		
}, options);

// methods ======================
// generating a hash
/*
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
*/
// checking if password is valid
userSchema.methods.validPassword = function(password) {
	console.log('Abe lawade');
	console.log(this.password);
    return this.password==password;
};



// create the model for users and expose it to our app
var userModel = mongoose.model('User', userSchema);
//------------------------------------------------------------
    var studentModel = userModel.discriminator('Student',
      new mongoose.Schema({class_ref: { type: mongoose.Schema.ObjectId, ref: 'Class'}}
	  , options)
	  );

//------------------------------------------------------------

var classSchema = mongoose.Schema({ 
		name: {type: String, trim: true,unique: true, required: true},
		students: [{ type: mongoose.Schema.ObjectId, ref: 'User', message:'user should be student', validate : validator }]		
});

function validator (arr, callback) {

	userModel.findOne({'_id': arr}, function(err, val){
		if(err) return callback(false);;
		// if user must have student role.
		if (val && val.role == 'ST') {
			return callback(true);
		} 
		return callback(false);
	 });
}

/*
classSchema.pre('findOneAndRemove', function(next) {
	var self = this;
	console.log('in preeeeeeeeeeeeeee');
	console.log(self._id);
   studentModel.update({'classRef':self._id}, {$set: {'classRef': null}}, {multi:true}, function(err, numAffected){
        console.log('updated ---> ', err, numAffected);
		 next();
   });
 
});

*/
var classModel = mongoose.model('Class', classSchema);

module.exports = {
    User: userModel,
	Class : classModel,
	Student : studentModel
};