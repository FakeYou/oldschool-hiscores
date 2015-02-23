'use strict';

App.Jobs.Scrapers = JobCollection('scrapers');

if(Meteor.isServer) {

  App.Jobs.Scrapers.allow({
    admin: function() {
      return true;
    }
  });

  Meteor.publish('scraperJobs', function() {
    return App.Jobs.Scrapers.find();
  });

  Meteor.startup(function() {
    App.Jobs.Scrapers.startJobs();
  });
}
