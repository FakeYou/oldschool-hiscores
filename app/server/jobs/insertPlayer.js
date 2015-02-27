'use strict';

Job.processJobs('scrapers', 'insertPlayer', function(job, cb) {
  var data;
  var username = job.data.username;
  var mode = job.data.mode;

  if(App.Collections.Players.findOne({ username: username })) {
    job.fail('player already exists');
    return cb();
  }

  try {
    data = App.Scrapers.oldSchoolPlayerLite(username, mode);
  }
  catch(err) {
    job.fail(err.message);
    return cb();
  }

  var hiscores = {
    timestamp: new Date(),
    skills: _.clone(data)
  };

  var doc = App.Schemas.Player.clean({
    username: username,
    member: false,
    oldestHiscores: hiscores,
    newestHiscores: hiscores,
    skillChanges: []
  }, {
    extendAutoValueContext: { isInsert: true }
  });

  var context = App.Schemas.Player.newContext();
  var isValid = context.validate(doc);

  if(!isValid) {
    console.error(context.invalidKeys());
    job.fail();
    return cb();
  }

  var player = new App.Models.Player(doc);

  if(!player.isMember()) {
    var id = App.Collections.Players.insert(player);
    console.log('insert', player.username, id);  
  }

  job.done();

  cb();
});
