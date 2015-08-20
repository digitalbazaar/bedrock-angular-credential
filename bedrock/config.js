/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 */
var fs = require('fs');
var path = require('path');

module.exports = function(bedrock) {
  var prepare = path.join(__dirname, 'prepare.js');
  if(bedrock.config.protractor && fs.existsSync(prepare)) {
    //var protractor = bedrock.config.protractor.config;
    // add protractor tests
    // protractor.suites['bedrock-angular-credential'] =
    //   path.join(__dirname, './tests/**/*.js');
    // protractor.params.config.onPrepare.push(prepare);
  }

  // FIXME: overrides config set elsewhere
  //bedrock.config.views.vars['bedrock-angular-credential'] = {
  //  libraries: {}
  //};
  bedrock.config.views.vars['bedrock-angular-credential'] =
    bedrock.config.views.vars['bedrock-angular-credential'] || {};
  bedrock.config.views.vars['bedrock-angular-credential'].libraries =
    bedrock.config.views.vars['bedrock-angular-credential'].libraries || {};
};
