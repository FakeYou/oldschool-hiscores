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
    var player = App.Collections.Players.findOne({ username: username });

    var allowedPlayers = [
      'Ironwyn',
      'Perm Iron',
      'MRC',
      'No Bank',
      'UIM Torwent',
      'BathSalts420',
      'Lowlander',
      'f0od',
      'Lord Ironman',
      'TellMeToFish'
    ];

    if(!_.contains(allowedPlayers, username)) {
      return;
    }

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