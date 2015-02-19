'use strict';

App.Collections.Players = new Mongo.Collection('players');

Meteor.startup(function() {
  App.Collections.Players.attachSchema(App.Schemas.Player);

  // var player = {
  //   username: 'ijzerdraak',
  //   skills: [
  //     {
  //       name: 'Overall',
  //       rank: 1,
  //       level: 757,
  //       xp: 1890212
  //     }
  //   ]
  // };

  // var valid = App.Collections.Players
  //   .simpleSchema()
  //   .namedContext('test')
  //   .validate(player, { modifier: false });

  // if(!valid) {
  //   console.log(App.Collections.Players
  //   .simpleSchema()
  //   .namedContext('test')
  //   .invalidKeys());
  // }
  // else {
  //   App.Collections.Players.insert(player, function(err, result) {
  //     console.log(err, result);
  //   });
  // }
});