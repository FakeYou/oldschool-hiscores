'use strict';

Meteor.publish('players', function() {
  return App.Collections.Players.find();
});