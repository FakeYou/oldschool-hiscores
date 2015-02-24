'use strict';

Meteor.publish('player', function(username) {
  check(username, String);

  var filter = new RegExp('^' + username + '$', 'i');

  return App.Collections.Players.find({ username: filter });
});