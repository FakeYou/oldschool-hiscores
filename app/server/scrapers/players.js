'use strict';

var xray   = Meteor.npmRequire('x-ray');
var url    = Meteor.npmRequire('url');
var Future = Npm.require('fibers/future');

App.Scrapers.oldSchoolPlayers = function(mode, pages) {
  pages = pages || 1;

  check(mode, App.Match.modes);
  check(pages, Match.Integer);

  var future = new Future();

  var location = url.parse(App.settings.scrapers.oldSchoolPlayers.urls[mode]);

  xray(location.format())
    .select(['#contentHiscores tbody tr:nth-child(2) td:nth-child(2) a'])
    .paginate(' #contentHiscores tbody tr:nth-child(2) td:nth-child(5) tr:nth-child(2) a[href]')
    .limit(pages)
    .run(function(err, players) {
      players = _.map(players, function(player) {
        // replace any invalid characters with a space
        return player.replace(/[^a-zA-Z0-9_ ]/g, ' ');
      });

      if(err) {
        future.throw(err);
      }
      else if(players.length === 0) {
        future.throw('no results');
      }
      else {
        future.return(players);
      }
    });

  return future.wait();
};