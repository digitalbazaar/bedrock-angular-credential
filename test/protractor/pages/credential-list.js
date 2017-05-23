/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var api = {};
module.exports = api;

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
