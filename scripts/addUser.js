var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/portal_db');

var User    = require('../models/user');

var newUser            = new User();
 // set the user's local credentials
newUser.username = 'admin';
newUser.password = 'admin';

// save the user
newUser.save(function(err) {
  if (err) {
   console.log(err);
   throw err;
  }
   console.log('Added user '  + newUser.username + ':' + newUser.password);
   process.exit();
});
