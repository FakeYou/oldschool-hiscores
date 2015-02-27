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

    // if the newestUpdate + 1 hour is later than now then we don't want to update yet
    // if(moment(player.updatedAt).add(1, 'hour').isAfter(moment())) {
    //   return;      
    // }

    App.Jobs.Scrapers.createJob('updatePlayer', { playerId: player._id, mode: mode })
      .priority('low')
      .retry({
        retries: App.settings.jobs.scrapers.updatePlayer.retryAmount,
        wait: App.settings.jobs.scrapers.updatePlayer.retryWait,
      })
      .delay(App.settings.jobs.scrapers.updatePlayer.delay * i)
      .save();
  });

  job.done();

  return cb();
});
