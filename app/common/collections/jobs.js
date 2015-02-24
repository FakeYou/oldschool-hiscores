'use strict';

App.Jobs.Scrapers = JobCollection('scrapers');

if(Meteor.isServer) {
  App.Jobs.Scrapers.allow({
    admin: function() {
      return true;
    }
  });

  Meteor.publish('scraperJobs', function() {
    console.log(App.Jobs.Scrapers.find({}, { fields: { _id: 1 }}).fetch());
    return App.Jobs.Scrapers.find();
  });

  Meteor.startup(function() {
    App.Jobs.Scrapers.startJobs();
  });
}
