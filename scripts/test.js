var mongoose = require('mongoose');
var async = require('async');
mongoose.connect('mongodb://localhost/test');

var models    = require('../models/models');
var options = {discriminatorKey: 'kind'};

    var eventSchema = new mongoose.Schema({time: Date}, options);
    var Event = mongoose.model('Event', eventSchema);

    // ClickedLinkEvent is a special type of Event that has
    // a URL.
    var ClickedLinkEvent = Event.discriminator('ClickedLink',
      new mongoose.Schema({url: String}, options));

    // When you create a generic event, it can't have a URL field...
    var genericEvent = new Event({time: Date.now(), url: 'google.com'});
	genericEvent.save();

    // But a ClickedLinkEvent can
    var clickedEvent =
      new ClickedLinkEvent({time: Date.now(), url: 'google.com'});
    clickedEvent.save();
	