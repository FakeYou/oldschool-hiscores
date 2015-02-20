// 'use strict';

// var jobs = JobCollection('scrapeJobs');

// jobs.allow({
//   admin: function(userId) {
//     return (userId ? true : false);
//   }
// });

// Meteor.startup(function() {
//   Meteor.publish('jobs', function() {
//     return jobs.find();
//   });

//   jobs.startJobs();

//   Meteor.setTimeout(function() {
//     console.log('[startup] start job');

//     _.times(10, function(i) {
//       var job = jobs.createJob('player', { username: 'ijzerdraak', index: i });
//       job
//         .retry({ retries: 5, wait: 5 })
//         .save();
//     });

//     var job = jobs.createJob('player', { username: 'ijzerdraak', index: 11 });
//     job
//       .priority('high')
//       .retry({ retries: 5, wait: 5 })
//       .save();

//   }, 20 * 1000);
// });

// var workers = Job.processJobs('scrapeJobs', 'player', function(job, cb) {
//   console.log(job.data);

//   if(Math.random() > 1) {
//     console.log('[process] fail');
//     job.fail('failed');
//   }
//   else {
//     console.log('[process] done');
//     job.done();
//   }

//   cb();1
// });