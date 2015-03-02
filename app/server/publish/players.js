'use strict';

Meteor.publish('players', function() {
  var query = {
    'newestHiscores.skills': { $not: { $size: 0 }}
  };

  var options = {
    fields: {
      skillChanges: 0,
      oldestHiscores: 0
    }
  };

  return App.Collections.Players.find(query, options);
});