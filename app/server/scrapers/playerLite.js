'use strict';

var http   = Meteor.npmRequire('http');
var url    = Meteor.npmRequire('url');
var Future = Npm.require('fibers/future');
 
App.Scrapers.oldSchoolPlayerLite = function(username, mode) {
  check(username, String);
  check(mode, App.Match.modes);

  var future = new Future();

  var location = url.parse(App.settings.scrapers.oldSchoolPlayerLite.urls[mode]);
  location.query ={ player: username };

  var req = http.get(location.format(), function(res) {
    var content = '';
    res.on('data', function(chunk) {
      content += chunk;
    });

    res.on('end', function() {

      if(content.length === 0) {
        return future.throw('no results');
      }

      var skills = content
        .trim()
        .split('\n')
        .slice(0, -3);

      var data = _.map(skills, function(skill, i) {
        var skillname = App.settings.skills.all[i];
        var numbers = skill.split(',');

        return {
          name: skillname,
          rank: numbers[0],
          level: numbers[1],
          xp: numbers[2],
        };
      });

      future.return(data);

    });
  });

  req.on('error', function(err) {
    future.throw(err);
  });

  return future.wait();
};
