/*
 * Bedrock Configuration.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 */
var fs = require('fs');
var path = require('path');

module.exports = function(bedrock) {
  // var prepare = path.join(__dirname, 'prepare.js');
  if(bedrock.config.protractor) {
    var protractor = bedrock.config.protractor.config;
    // add protractor tests
    protractor.suites['bedrock-angular-credential'] =
      path.join(__dirname, './tests/**/*.js');
    // protractor.params.config.onPrepare.push(prepare);
  }

  // FIXME: overrides config set elsewhere
  //bedrock.config.views.vars['bedrock-angular-credential'] = {
  //  libraries: {}
  //};
  // export bedrock-credentials-rest location for UI
  var vars = bedrock.config.views.vars;
  vars['bedrock-angular-credential'] =
    vars['bedrock-angular-credential'] || {};
  vars['bedrock-angular-credential'].libraries =
    vars['bedrock-angular-credential'].libraries || {};
  if('credentials-rest' in bedrock.config) {
    vars['bedrock-angular-credential'].credentialsBasePath =
      bedrock.config['credentials-rest'].basePath || '';
  } else {
    vars['bedrock-angular-credential'].credentialsBasePath = '';
  }
};
