'use strict';

Job.processJobs('scrapers', 'getPlayers', function(job, cb) {
  var mode = job.data.mode;
  var usernames;

  try {
    usernames = App.Scrapers.oldSchoolPlayers(mode, App.settings.jobs.scrapers.getPlayers.pages);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
  }

  _.each(usernames, function(username, i) {
    var player = App.Collections.Players.findOne({ username: username });

    // if the player doesn't exists then create a new entry
    if(!player) {
      App.Jobs.Scrapers.createJob('insertPlayer', { username: username, mode: mode })
        .priority('normal')
        .retry({
          retries: App.settings.jobs.scrapers.insertPlayer.retryAmount,
          wait: App.settings.jobs.scrapers.insertPlayer.retryWait,
        })
        .delay(App.settings.jobs.scrapers.insertPlayer.delay * i)
        .save();
    }
  });

  job.done();

  cb();
});