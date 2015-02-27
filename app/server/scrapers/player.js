'use strict';

var xray   = Meteor.npmRequire('x-ray');
var url    = Meteor.npmRequire('url');
var Future = Npm.require('fibers/future');
 
App.Scrapers.oldSchoolPlayer = function(username, mode) {
  check(username, String);
  check(mode, App.Match.modes);

  var future = new Future();

  var location = url.parse(App.settings.scrapers.oldSchoolPlayer.urls[mode]);
  location.query = { user1: username };

  xray(location.format())
    .prepare('parseNumber', _.parseNumber)
    .prepare('trim', trim)
    .prepare('trimUsername', trimUsername)
    .select([{
        $root: '#contentHiscores tr:nth-child(n+4)',
        name: 'td:nth-child(2) | trim',
        rank: 'td:nth-child(3) | parseNumber',
        level: 'td:nth-child(4) | parseNumber',
        xp: 'td:nth-child(5) | parseNumber',
    }])
    .run(function(err, data) {
      if(err) {
        future.throw(err);
      }
      else {
        try {
          check(data, [{ 
            name: String,
            rank: Match.Integer,
            level: Match.Integer,
            xp: Match.Integer,
          }]);
        }
        catch(e) {
          return future.throw(e);
        }

        future.return(data);
      }
    });

  return future.wait();
};

function trimUsername(string) {
  return string.replace('Personal scores for ', '');
}

function trim(string) {
  return string.trim();
}