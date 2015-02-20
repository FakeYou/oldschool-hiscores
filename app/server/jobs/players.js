'use strict';

var url = 'http://services.runescape.com/m=hiscore_oldschool_ultimate/overall.ws';

var oldJobs = App.Jobs.Scrapers.find({ 
  status: 'waiting',
  type: 'getPlayers'
}, {
  fields: { '_id': 1 }
}).fetch();

App.Jobs.Scrapers.cancelJobs(_.pluck(oldJobs, '_id'));

Meteor.startup(function() {
  var job = App.Jobs.Scrapers.createJob('getPlayers', { url: url, date: Date.now() });

  job
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

  Job.processJobs('scrapers', 'getPlayers', function(job, cb) {
    try {
      var players = App.Scrapers.oldSchoolPlayers(url, 1);
      console.log(Date.now(), players);
      job.done();
    }
    catch(err) {
      job.fail(err.message);
    }

    cb();
  });

});