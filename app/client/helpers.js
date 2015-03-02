'use strict';

UI.registerHelper('log', console.log.bind(console));

UI.registerHelper('session', function(key) {
  console.log(Session.get(key));
  return Session.get(key);
});

UI.registerHelper('formatNumber', function(number) {
  return s.numberFormat(number);
});

UI.registerHelper('skills', function(type) {
  type = type || 'all';

  return App.settings.skills[type];
});

UI.registerHelper('modes', function() {
  return App.settings.modes;
});

UI.registerHelper('params', function() {
  return Router.current().params;
});