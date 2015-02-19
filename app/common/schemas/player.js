'use strict';

App.Schemas.Player = new SimpleSchema({
  username: {
    type: String,
    label: 'Username',
    min: 3,
    max: 12
  },
  skills: {
    type: [Object]
  },
  'skills.$.name': {
    type: String,
    label: 'Name',
    min: 5,
    max: 20
  },
  'skills.$.rank': {
    type: Number,
    label: 'Rank',
    min: 1,
    max: 1000000
  },
  'skills.$.level': {
    type: Number,
    label: 'Level',
    min: 1,
    max: 2500
  },
  'skills.$.xp': {
    type: Number,
    label: 'Experience',
    min: 0,
    max: 200000000
  },
});
