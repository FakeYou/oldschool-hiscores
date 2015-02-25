'use strict';

// Match any skillname that is defined in settings
App.Match.skill = Match.Where(function(n) {
  return _.contains(App.settings.skills.all, n);
});

// Match any skillname that is defined as free in settings
App.Match.free = Match.Where(function(n) {
  return _.contains(App.settings.skills.free, n);
});

// Match any skillname that is defined as member in settings
App.Match.member = Match.Where(function(n) {
  return _.contains(App.settings.skills.member, n);
});