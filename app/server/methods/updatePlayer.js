'use strict';

Meteor.methods({ 
  'updatePlayer': function updatePlayer(playerId, mode) {
    console.log(playerId, mode);

    var data;
    var player = App.Collections.Players.findOne({ _id: playerId });

    if(_.isUndefined(player)) {
      throw new Meteor.Error('player not found');
    }

    try {
      data = App.Scrapers.oldSchoolPlayerLite(player.username, mode);
    }
    catch(err) {
      throw new Meteor.Error(err.message);
    }

    var changes = player.getSkillChanges(player.newestHiscores.skills, data);

    // we only need to update if there changes
    if(changes.length > 0) {
      var hiscores = {
        timestamp: new Date(),
        skills: data
      };

      // don't keep update for people who became member
      player.newestHiscores = hiscores;
      if(!player.isMember()) {
        App.Collections.Players.update({ _id: player._id }, {
          $set: { newestHiscores: hiscores },
          $push: { skillChanges: { $each: changes } }
        });
      }
      else {
        App.Collections.Players.update({ _id: player._id}, { $set: { member: true }});
      }
    }

    return true;
  }
});

