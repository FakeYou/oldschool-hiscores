'use strict';

Router.route('/', function() {
  this.wait(Meteor.subscribe('scraperJobs'));

  if(this.ready()) {
    var jobs = App.Jobs.Scrapers.find({}, { sort: { created: -1 }});
    console.log(jobs.fetch());

    this.render('jobs', {
      data: { jobs: jobs }
    });
  } 
  else {
    this.render('loading');
  }
});