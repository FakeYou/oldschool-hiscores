'use strict';

App.Collections.Players = new Mongo.Collection('players', {
  transform: function(doc) { return new App.Models.Player(doc); }
});

Meteor.startup(function() {
  App.Collections.Players.attachSchema(App.Schemas.Player);
});