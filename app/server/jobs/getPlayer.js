'use strict';

var querystring = Npm.require('querystring');


Job.processJobs('scrapers', 'getPlayer', function(job, cb) {
  var data;
  var playerId = job.data.playerId;
  var mode = job.data.mode;

  var player = App.Collections.Players.findOne({ _id: playerId });

  if(!player) {
    job.fail('player ' + job.data.playerId + ' not found');
    return cb();
  }

  var url = App.settings.jobs.scrapers.getPlayer.urls[mode] + '?' + querystring.stringify({ user1: player.username });

  try {
    data = App.Scrapers.oldSchoolPlayer(url);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
  }

  data = {
    timestamp: Date.now(),
    mode: mode,
    skills: _.map(data.skills, function(skill) {
      return App.Schemas.Skill.clean(skill);
    })
  };

  // TODO: validate data

  App.Collections.Players.update(player._id, { $push: { data: data }});
  console.log('update', player.username, player._id);  

  job.done();

  cb();
});
