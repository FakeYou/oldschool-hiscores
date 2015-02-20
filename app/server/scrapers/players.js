'use strict';

var xray = Meteor.npmRequire('x-ray');
var Future = Npm.require('fibers/future');

App.Scrapers.oldSchoolPlayers = function(url, pages) {
  var future = new Future();

  pages = pages || 1;

  xray(url)
    .select(['#contentHiscores tbody tr:nth-child(2) td:nth-child(2) a'])
    .paginate(' #contentHiscores tbody tr:nth-child(2) td:nth-child(5) tr:nth-child(2) a[href]')
    .limit(pages)
    .run(function(err, players) {
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