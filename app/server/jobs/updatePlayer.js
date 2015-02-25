'use strict';

var querystring = Npm.require('querystring');

Job.processJobs('scrapers', 'updatePlayer', function(job, cb) {
  console.log('updatePlayer', job.data);

  var data;
  var player = App.Collections.Players.findOne({ _id: job.data.playerId });
  var mode = job.data.mode;

  if(_.isUndefined(player)) {
    job.fail('player not found, ' + job.data.playerId);
    return cb();    
  }

  var url = App.settings.jobs.scrapers.updatePlayer.urls[mode] + '?' + querystring.stringify({ user1: player.username });

  try {
    data = App.Scrapers.oldSchoolPlayer(url);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
  }

  var changes = player.getSkillChanges(player.newestHiscores.skills, data.skills);

  // we only need to update if there changes
  if(changes.length > 0) {
    var hiscores = {
      timestamp: new Date(),
      skills: data.skills
    };
    
    App.Collections.Players.update({ _id: player._id }, {
      $set: { newestHiscores: hiscores },
      $push: { skillChanges: { $each: changes } }
    });
  }

  job.done();
  cb();
});
