'use strict';

Template.playersSingle.helpers({
  latestData: function() {
    var latestData = _.chain(this.player.data)
      .sortBy(function(data) { return data.timestamp; })
      .last()
      .value();

    return latestData;
  }
});