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
  var job = App.Jobs.Scrapers.createJob('getPlayers', { url: url });

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
    var url = job.data.url;
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

      if(!player) {
        playerId = App.Collections.Players.insert({
          username: username,
          data: []
        });
        
        console.log('insert', username, playerId);  
      }
      else {
        playerId = player._id;
      }

      var job = App.Jobs.Scrapers.createJob('getPlayer', { playerId: playerId });
      job.priority('normal')
        .retry({
          retries: App.settings.jobs.scrapers.getPlayer.retryAmount,
          wait: App.settings.jobs.scrapers.getPlayer.retryWait,
        })
        .delay(App.settings.jobs.scrapers.getPlayer.delay * i)
        .save();
    });

    job.done();

    cb();
  });

});