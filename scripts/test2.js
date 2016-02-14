var mongoose = require('mongoose');
var async = require('async');
mongoose.connect('mongodb://localhost/portal_db');

var models    = require('../models/models');
var classRef = {};

//ObjectId("56c062d76634997c2e3c22f6")

models.Student.update({ 

    '_id': { $in: [
        '56c06231e52aaf980803dc0a',
        '56c06231e52aaf980803dc09'
    ]}




 }, {  classRef : '56c06231e52aaf980803dc00' }, { multi: true }, function (err, raw) {
  if (err) return handleError(err);
  console.log('The raw response from Mongo was ', raw);
  process.exit();
});