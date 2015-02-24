'use strict';

Router.route('/players', function() {
  NProgress.start();
  this.subscribe('players').wait();
  this.layout('layout');

  if(this.ready()) {
    var data = function() {
      var players = App.Collections.Players.find().fetch();

      players = _.sortBy(players, function(player) {
        var skill = _.chain(player.data)
          .sortBy(function(data) { return data.timestamp; })
          .pluck('skills')
          .last()
          .findWhere({ name: 'Overall' })
          .value();

        console.log(skill);

        if(_.isUndefined(skill)) {
          return Infinity;
        }
        else {
          return skill.rank;
        }
      });

      return {
        players: players
      }
    };

    this.render('playersIndex', { data: data });
    NProgress.done();
  }
}, { name: 'players.index' });

Router.route('/players/:username', function() {
  var username = this.params.username;

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
    console.log('loading');
  }
}, { name: 'players.single' });
