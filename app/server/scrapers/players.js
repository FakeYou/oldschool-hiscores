'use strict';

var xray = Meteor.npmRequire('x-ray');
var Future = Npm.require('fibers/future');


App.Scrapers.oldSchoolPlayers = function(url) {

  var future = new Future();

  xray(url)
    .select(['#contentHiscores tbody tr:nth-child(2) td:nth-child(2) a[href]'])
    .paginate(' #contentHiscores tbody tr:nth-child(2) td:nth-child(5) tr:nth-child(2) a[href]')
    .delay(5000, 10000)
    .limit(1)
    .run(function(err, urls) {
      if(err) {
        future.throw(err);
      }
      else {
        urls = _.map(urls, function(url) {
          return url.replace('/overall.ws', '');
        });

        future.return(urls);
      }
    });

  return future.wait();
};