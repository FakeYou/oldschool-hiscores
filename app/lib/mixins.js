'use strict';

_.mixin({
  parseNumber: function(string) {
    return parseInt(string.replace(/,/g, ''), 10);
  }
});