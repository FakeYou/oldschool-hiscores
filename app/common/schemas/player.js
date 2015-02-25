'use strict';

App.Schemas.Hiscores = new SimpleSchema({
  timestamp: {
    type: Date
  },
  skills: {
    type: [Object]
  },
  'skills.$.name': {
    type: String,
    allowedValues: App.settings.skills.all
  },
  'skills.$.rank': {
    type: Number,
    decimal: true,
    optional: true,
    min: 1,
    max: 1000000
  },
  'skills.$.level': {
    type: Number,
    decimal: true,
    defaultValue: 1,
    min: 1,
    max: 2500,
  },
  'skills.$.xp': {
    type: Number,
    decimal: true,
    defaultValue: 0,
    min: 0,
    max: 200000000
  }
});

App.Schemas.SkillChange = new SimpleSchema({
  timestamp: {
    type: Date
  },
  name: {
    type: String,
    allowedValues: App.settings.skills.all
  },
  rank: {
    type: Number,
    defaultValue: 0
  },
  level: {
    type: Number,
    decimal: true,
    defaultValue: 0,
    min: 0,
    max: 2500,
  },
  xp: {
    type: Number,
    decimal: true,
    defaultValue: 0,
    min: 0,
    max: 200000000
  }
});

App.Schemas.Player = new SimpleSchema({
  username: {
    type: String,
    unique: true,
    min: 3,
    max: 12
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } 
      else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } 
      else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    }
  },
  newestHiscores: {
    type: App.Schemas.Hiscores
  },
  oldestHiscores: {
    type: App.Schemas.Hiscores
  },
  skillChanges: {
    type: [App.Schemas.SkillChange]
  }
});