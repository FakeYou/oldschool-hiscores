'use strict';

Template.playersIndex.helpers({
  skill: function(skillname) {
    return _.findWhere(this.newestHiscores.skills, { name: skillname });
  }
});