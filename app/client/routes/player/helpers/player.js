'use strict';

Template.playersSingle.events({
  'click .update-player': function updatePlayer(e) {
    var $target = $(e.target);
    $target.prop('disabled', true);

    Meteor.call('updatePlayer', this._id, 'ultimate', function(err) {
      if(err) {
        Session.set('updatePlayerError', err.message);
      }
    });

    setTimeout(function() {
      $target.prop('disabled', false);
    }, 1500);

    return false;
  }
});