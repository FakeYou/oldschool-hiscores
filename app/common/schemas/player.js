'use strict';

App.Schemas.Skill = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    min: 5,
    max: 20,
    allowedValues: App.settings.skills.all
  },
  rank: {
    type: Number,
    label: 'Rank',
    decimal: true,
    optional: true,
    min: 1,
    max: 1000000
  },
  level: {
    type: Number,
    label: 'Level',
    decimal: true,
    defaultValue: 1,
    min: 1,
    max: 2500,
  },
  xp: {
    type: Number,
    label: 'Experience',
    decimal: true,
    defaultValue: 0,
    min: 0,
    max: 200000000
  }
});

App.Schemas.Player = new SimpleSchema({
  username: {
    type: String,
    label: 'Username',
    unique: true,
    min: 3,
    max: 12
  },
  data: {
    type: [Object]
  },
  'data.$.timestamp': {
    type: Date
  },
  'data.$.skills': {
    type: [App.Schemas.Skill]
  }
});