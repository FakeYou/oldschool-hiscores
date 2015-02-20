'use strict';

App.Jobs.Scrapers = JobCollection('scrapers');

if(Meteor.isServer) {

  App.Jobs.Scrapers.allow({
    admin: function() {
      console.log(this.userId);

      return (userId ? true : false);
    }
  });

  Meteor.publish('scraperJobs', function() {
    return App.Jobs.Scrapers.find();
  });

  Meteor.startup(function() {
    App.Jobs.Scrapers.startJobs();
  });
}
