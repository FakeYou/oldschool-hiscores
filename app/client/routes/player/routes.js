'use strict';

Router.route('/players/:skillname?', function() {
  NProgress.start();
  this.subscribe('players').wait();
  this.layout('layout');

  var skillname = this.params.skillname || 'Overall';
  this.params.skillname = skillname;

  if(this.ready()) {
    var data = function() {
      var players = App.Collections.Players.find().fetch();

      players = _.sortBy(players, function(player) {
        return _.findWhere(player.newestHiscores.skills, { name: skillname }).rank;
      });

      return {
        players: players
      };
    };

    this.render('playersIndex', { data: data });
    NProgress.done();
  }
  else {
    this.render('loading');
  }
}, { name: 'players.index' });

Router.route('/player/:username', function() {
  var username = this.params.username;
  Session.set('updatePlayerError', false);

  NProgress.start();
  this.subscribe('player', username).wait();
  this.layout('layout');

  if(this.ready()) {
    var data = function() {
      return {
        player: App.Collections.Players.findOne()
      };
    };

    this.render('playersSingle', { data: data });
    NProgress.done();
  }
  else {
    this.render('loading');
  }
}, { name: 'players.single' });
