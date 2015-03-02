'use strict';

App.Models.Player = function(doc) {
  _.extend(this, doc);
};

_.extend(App.Models.Player.prototype, {
  // get the changes in rank, level and experience between two skill sets
  getSkillChanges: function(oldSkills, newSkills) {
    var changes = _.map(oldSkills, function(oldSkill) {
      var newSkill = _.findWhere(newSkills, { name: oldSkill.name });


      var difference = {
        rank: newSkill.rank - oldSkill.rank,
        level: newSkill.level - oldSkill.level,
        xp: newSkill.xp - oldSkill.xp
      };

      // check if there was any change
      // if not discard this from the changes
      if(difference.rank === 0 && difference.level === 0 && difference.xp === 0) {
        return false;
      }
      else {
        difference.timestamp = new Date();
        difference.name = oldSkill.name;

        return difference;
      }
    });

    // remove all discarded changes
    changes = _.filter(changes, _.identity);

    return changes;
  },

  // get the changes for a skill sorted from oldest to newest
  getSortedSkillChanges: function(skillname) {
    check(skillname, App.Match.skill);

    return _.chain(this.skillChanges)
      .where({ name: skillname })
      .sortBy(function(change) {
        return change.timestamp;
      })
      .value();
  },

  getSkillAtDate: function(skillname, date) {
    check(skillname, App.Match.skill);
    check(date, Date);

    var skill = _.clone(_.findWhere(this.oldestHiscores.skills, { name: skillname }));
    var changes = this.getSortedSkillChanges(skillname);

    // filter to remove all changes after the given date
    changes = _.filter(changes, function(change) {
      if(moment(change.timestamp).isBefore(date)) {
        return true;
      }
    });

    // iterate through all changes and apply the changes to the skill set
    _.each(changes, function(change) {
      skill.rank += change.rank;
      skill.level += change.level;
      skill.xp += change.xp;
    });

    return skill;
  },

  isMember: function() {
    var memberSkills = App.settings.skills.member;
    var member = false;

    _.each(memberSkills, function(skillname) {
      var skill = _.findWhere(this.newestHiscores.skills, { name: skillname });

      if(_.isUndefined(skill)) {
        console.log(skillname, this.username);
        return;
      }

      if(skill.xp > 0 || skill.level > 1) {
        member = true;
      }
    }, this);

    return member;
  },

  freeHiscores: function() {
    return _.filter(this.newestHiscores.skills, function(hiscore) {
      return _.contains(App.settings.skills.free, hiscore.name);
    });
  }
});
