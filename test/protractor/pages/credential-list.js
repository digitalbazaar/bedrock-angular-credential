/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var bedrock = global.bedrock;

var api = {};
module.exports = api;

var by = global.by;
var element = global.element;
var should = global.should;
var expect = global.expect;
var protractor = global.protractor;
var EC = protractor.ExpectedConditions;

api.COMPONENT_TAG = 'br-credentials';
api.component = element(by.tagName(api.COMPONENT_TAG));

api.actionMenuButton = function() {
  return api.component.element(by.attribute('stackable-trigger', '$ctrl.menu'));
};

api.actionMenu = function() {
  var actionMenu = element(by.tagName('br-credentials-action-menu'));
  browser.wait(EC.visibilityOf(actionMenu), 3000);
  return actionMenu;
};

api.credentials = function() {
  return element.all(by.repeater('credential in model.credentials'));
};

api.clickCredential = function(credential) {
  credential.element(by.tagName('a')).click();
};

api.credentialLink = function(credential) {
  return credential.element(by.tagName('a')).getAttribute('href');
};
