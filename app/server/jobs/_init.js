'use strict';

Meteor.startup(function() {
  // remove previously scheduled 'getPlayers' jobs
  var oldJobs = App.Jobs.Scrapers.find({ 
    status: 'waiting',
    type: { $in: ['getPlayers', 'updatePlayers'] }
  }, { fields: { _id: 1 }}).fetch();

  if(oldJobs.length) {
    App.Jobs.Scrapers.cancelJobs(_.pluck(oldJobs, '_id'));
  }

  // setup a repeating 'getPlayers' job
  App.Jobs.Scrapers.createJob('getPlayers', { mode: 'ultimate' })
    .priority('low')
    .retry({
      retries: App.settings.jobs.scrapers.getPlayers.retryAmount,
      wait: App.settings.jobs.scrapers.getPlayers.retryWait
    })
    .repeat({
      repeats: Job.forever,
      wait: App.settings.jobs.scrapers.getPlayers.repeatWait
    })
    .save();

  // setup a repeating 'updatePlayers' job
  App.Jobs.Scrapers.createJob('updatePlayers', { mode: 'ultimate' })
    .priority('normal')
    .retry({
      retries: App.settings.jobs.scrapers.updatePlayers.retryAmount,
      wait: App.settings.jobs.scrapers.updatePlayers.retryWait
    })
    .repeat({
      repeats: Job.forever,
      wait: App.settings.jobs.scrapers.updatePlayers.repeatWait
    })
    .save();
  });