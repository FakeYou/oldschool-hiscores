'use strict';

var querystring = Npm.require('querystring');

var baseUrl = 'http://services.runescape.com/m=hiscore_oldschool_ultimate/hiscorepersonal.ws';

Meteor.startup(function() {
  Job.processJobs('scrapers', 'getPlayer', function(job, cb) {
    var data;
    var player = App.Collections.Players.findOne({ _id: job.data.playerId });

    if(!player) {
      job.fail('player ' + job.data.playerId + ' not found');
      return cb();
    }

    var url = baseUrl + '?' + querystring.stringify({ user1: player.username });

    try {
      data = App.Scrapers.oldSchoolPlayer(url);
    }
    catch(err) {
      job.fail(err.message);
      return cb();
    }

    data = {
      timestamp: Date.now(),
      skills: _.map(data.skills, function(skill) {
        return App.Schemas.Skill.clean(skill);
      })
    };

    // TODO: validate data

    console.log(data);

    App.Collections.Players.update(player._id, { $push: { data: data }});
    console.log('update', player.username, player._id);  

    job.done();

    cb();
  });
});