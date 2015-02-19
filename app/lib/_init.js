App = {};

if(Meteor.isServer && _.isEmpty(Meteor.settings)) {
  console.error('Settings not found, use --settings [file] to include settings for the app.');
  process.exit(0);
}

App.settings = Meteor.settings;

App.Schemas = {};
App.Collections = {};