'use strict';

Template.playersSingle.helpers({
  freeHiscores: function() {
    return _.filter(this.newestHiscores.skills, function(hiscore) {
      return _.contains(App.settings.skills.free, hiscore.name);
    });
  }
});