'use strict';

Job.processJobs('scrapers', 'updatePlayers', function(job, cb) {
  var mode = job.data.mode;

  var players = App.Collections.Players.find({}).fetch();

  _.each(players, function(player, i) {

    // check if there already is a job scheduled for this player and mode
    var job = App.Jobs.Scrapers.findOne({ 
      type: 'getPlayer',
      status: 'waiting',
      data: {
        playerId: player._id,
        mode: mode
      }
    });

    // don't schedule another job when there is already one scheduled
    if(job) {
      return;
    }

    // get the timestamp of the newest update
    var newestUpdate = _.chain(player.data)
      .pluck('timestamp')
      .sort()
      .last()
      .value();

    // if the newestUpdate + 1 hour is later than now then we don't want to update yet
    if(moment(newestUpdate).add(1, 'hour').isAfter(moment())) {
      return;      
    }

    App.Jobs.Scrapers.createJob('getPlayer', { playerId: player._id, mode: mode })
      .priority('normal')
      .retry({
        retries: App.settings.jobs.scrapers.getPlayer.retryAmount,
        wait: App.settings.jobs.scrapers.getPlayer.retryWait,
      })
      .delay(App.settings.jobs.scrapers.getPlayer.delay * i)
      .save();
  });

  job.done();

  return cb();
});
