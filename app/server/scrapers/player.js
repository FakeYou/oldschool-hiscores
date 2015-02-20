'use strict';

var xray = Meteor.npmRequire('x-ray');
var Future = Npm.require('fibers/future');
 
App.Scrapers.oldSchoolPlayer = function(url) {
  var future = new Future();

  xray(url)
    .prepare('toNumber', _.toNumber)
    .prepare('trim', String.prototype.trim)
    .prepare('trimUsername', trimUsername)
    .select({
      username: '#contentHiscores tr:nth-child(1) td b | trimUsername',
      skills: [{
        $root: '#contentHiscores tr:nth-child(n+4)',
        name: 'td:nth-child(2) | trim',
        rank: 'td:nth-child(3) | toNumber',
        level: 'td:nth-child(4) | toNumber',
        xp: 'td:nth-child(5) | toNumber',
      }]
    })
    .run(function(err, user) {
      if(user.username === 'QuitBcOfDcs') {
        console.log(user);
      }

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