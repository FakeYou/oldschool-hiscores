'use strict';

var querystring = Npm.require('querystring');

Job.processJobs('scrapers', 'insertPlayer', function(job, cb) {
  var data;
  var username = job.data.username;
  var mode = job.data.mode;

  var url = App.settings.jobs.scrapers.insertPlayer.urls[mode] + '?' + querystring.stringify({ user1: username });

  try {
    data = App.Scrapers.oldSchoolPlayer(url);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
  }

  var hiscores = {
    timestamp: new Date(),
    skills: data.skills
  };

  var player = new App.Models.Player({
    username: data.username,
    oldestHiscores: hiscores,
    newestHiscores: hiscores,
    skillChanges: []
  });

  var id = App.Collections.Players.insert(player);
  console.log('insert', player.username, id);  

  job.done();

  cb();
});
