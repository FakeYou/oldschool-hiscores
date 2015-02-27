'use strict';

Job.processJobs('scrapers', 'updatePlayer', function(job, cb) {
  var data;
  var player = App.Collections.Players.findOne({ _id: job.data.playerId });
  var mode = job.data.mode;

  if(_.isUndefined(player)) {
    job.fail('player not found, ' + job.data.playerId);
    return cb();    
  }

  // don't update players that are members
  if(player.member) {
    job.done();
    return cb();
  }

  try {
    data = App.Scrapers.oldSchoolPlayerLite(player.username, mode);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
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

  job.done();
  cb();
});
