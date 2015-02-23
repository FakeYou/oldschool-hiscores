'use strict';

var xray = Meteor.npmRequire('x-ray');
var Future = Npm.require('fibers/future');
 
App.Scrapers.oldSchoolPlayer = function(url) {
  var future = new Future();

  xray(url)
    .prepare('parseNumber', _.parseNumber)
    .prepare('trim', trim)
    .prepare('trimUsername', trimUsername)
    .select({
      username: '#contentHiscores tr:nth-child(1) td b | trimUsername',
      skills: [{
        $root: '#contentHiscores tr:nth-child(n+4)',
        name: 'td:nth-child(2) | trim',
        rank: 'td:nth-child(3) | parseNumber',
        level: 'td:nth-child(4) | parseNumber',
        xp: 'td:nth-child(5) | parseNumber',
      }]
    })
    .run(function(err, user) {
      if(err) {
        future.throw(err);
      }
      else {
        future.return(user);
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