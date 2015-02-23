'use strict';

Job.processJobs('scrapers', 'getPlayers', function(job, cb) {
  var mode = job.data.mode;
  var url = App.settings.jobs.scrapers.getPlayers.urls[mode];
  var usernames;

  try {
    usernames = App.Scrapers.oldSchoolPlayers(url, App.settings.jobs.scrapers.getPlayers.pages);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
  }

  _.each(usernames, function(username, i) {
    var playerId;
    var player = App.Collections.Players.findOne({ username: username });

    // if the player doesn't exists then create a new entry
    if(!player) {
      playerId = App.Collections.Players.insert({
        username: username,
        data: []
      });
      
      console.info('insert player', username, playerId);  
    }

    // var job = App.Jobs.Scrapers.createJob('getPlayer', { playerId: playerId });
    // job.priority('normal')
    //   .retry({
    //     retries: App.settings.jobs.scrapers.getPlayer.retryAmount,
    //     wait: App.settings.jobs.scrapers.getPlayer.retryWait,
    //   })
    //   .delay(App.settings.jobs.scrapers.getPlayer.delay * i)
    //   .save();
  });

  job.done();

  cb();
});