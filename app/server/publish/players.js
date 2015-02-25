'use strict';

Meteor.publish('players', function() {
  return App.Collections.Players.find({}, {
    fields: { skillChanges: 0, oldestHiscores: 0 }
  });
});