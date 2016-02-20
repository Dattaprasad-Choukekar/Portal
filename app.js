var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');
var class_ws = require('./routes/class_ws');
var students_ws = require('./routes/students_ws');
var course_ws = require('./routes/course_ws');
var files_ws = require('./routes/files_ws');
var messages_ws = require('./routes/messages_ws');
var broadcast_ws = require('./routes/broadcast_ws');


//Authentication Dependency
var session  = require('express-session');
var flash    = require('connect-flash');
var mongoose = require('mongoose');
var passport = require('passport');


// Mongoose
mongoose.connect('mongodb://localhost/portal_db', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session management and Passport config
app.use(session({secret:'ilovescotchscotchyscotchscotch', cookie: { 
  expires: new Date(Date.now() + 60 * 900000), 
  maxAge: 60 * 900000
}}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./config/passport')(passport);
require('./routes/login')(app, passport);



app.use('/', routes);
app.use('/api', users);
app.use('/api', class_ws);
app.use('/api', students_ws);
app.use('/api', course_ws);
app.use('/api', files_ws);
app.use('/api', messages_ws);
app.use('/api', broadcast_ws);







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: err,
	  stack: err.stack
  });
});


module.exports = app;
