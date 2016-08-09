/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var pages = global.bedrock.pages || {};

pages['bedrock-angular-credential'] = {};
pages['bedrock-angular-credential'].credentialViewer = require('./credential');
pages['bedrock-angular-credential'].credentialList =
  require('./credential-list');

module.exports = global.bedrock.pages = pages;
