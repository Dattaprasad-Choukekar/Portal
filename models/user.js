// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({ 
		username: {type: String,trim: true,unique: true,required: true},
		password: {type: String,required: true},
		role: {type: String, enum: ['AD', 'ST', 'TR'] , default: 'ST'},
		firstName : {type: String,required: true},
		lastName : {type: String,required: true},
		birthDate : Date,
		email: {type: String}, // Add validation
		sex : {type: String, enum: ['M', 'F', 'O'], default: 'M' }
		
});

// methods ======================
// generating a hash
/*
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
*/
// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return this.password==password;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);