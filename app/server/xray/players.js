'use strict';

var xray = Meteor.npmRequire('x-ray');
var Future = Npm.require('fibers/future');

var url = 'http://services.runescape.com/m=hiscore_oldschool_ultimate/overall.ws';

function toNumber(string) {
  string = string.replace(',', '');

  return parseInt(string, 10);
}

function trim(string) {
  string = string.replace('\n', '');
  string = string.trim();

  return string;
}

function trimUsername(string) {
  return string.replace('Personal scores for ', '');
}

Meteor.methods({
  scrapePlayers: function() {
    var future = new Future();

    xray(url)
      .select([ '#contentHiscores tbody tr:nth-child(2) td:nth-child(2) a[href]' ])
      .paginate(' #contentHiscores tbody tr:nth-child(2) td:nth-child(5) tr:nth-child(2) a[href]')
      .delay(5000, 10000)
      .limit(1)
      .run(function(err, users) {
        console.log(users);

        future.return(users);
      });

    var users = future.wait();
    users = [users[0]];

    _.each(users, function(user) {
      var url = user.replace('/overall.ws', '');

      xray(url)
        .prepare('toNumber', toNumber)
        .prepare('trim', trim)
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
          App.Collections.Players.insert(user);
        });
    });
  }
});