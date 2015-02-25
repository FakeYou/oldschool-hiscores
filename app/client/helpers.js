'use strict';

UI.registerHelper('log', console.log.bind(console));

UI.registerHelper('formatNumber', function(number) {
  return s.numberFormat(number);
});

UI.registerHelper('skills', function(type) {
  type = type || 'all';

  return App.settings.skills[type];
});

UI.registerHelper('params', function() {
  return Router.current().params;
});