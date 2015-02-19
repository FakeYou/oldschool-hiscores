'use strict';

App.Collections.Players = new Mongo.Collection('players');

Meteor.startup(function() {
  App.Collections.Players.attachSchema(App.Schemas.Player);
});