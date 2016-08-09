/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* jshint -W030 */

var bedrock = global.bedrock;

var api = {};
module.exports = api;

var by = global.by;
var element = global.element;
var should = global.should;
var expect = global.expect;
var protractor = global.protractor;
var EC = protractor.ExpectedConditions;

api.COMPONENT_TAG = 'br-credential-viewer';
api.component = element(by.tagName(api.COMPONENT_TAG));

api.actionMenuButton = function() {
  return api.component.element(by.attribute('stackable-trigger', '$ctrl.menu'));
};

api.actionMenu = function() {
  var actionMenu = element(by.tagName('br-credential-viewer-action-menu'));
  browser.wait(EC.visibilityOf(actionMenu), 3000);
  return actionMenu;
};

api.markPublic = function() {
  bedrock.waitForElementToShow(api.component);
  api.component.element(by.attribute('stackable-trigger', '$ctrl.menu'))
    .click();
  var actionMenu = element(by.tagName('br-credential-viewer-action-menu'));
  actionMenu.element(by.partialLinkText('Edit')).click();
  bedrock.waitForModalTransition();
  var editModal = element(by.tagName('br-edit-credential-modal'));
  var checkbox = editModal.element(by.model('model.allPublic'));
  checkbox.isSelected().then(function(selected) {
    // check the box if it's not selected
    if(!selected) {
      checkbox.click();
    }
  });
  editModal.element(by.partialButtonText('Save')).click();
  browser.wait(EC.stalenessOf(editModal), 3000);
};

api.markPrivate = function() {
  bedrock.waitForElementToShow(api.component);
  api.component.element(by.attribute('stackable-trigger', '$ctrl.menu'))
    .click();
  var actionMenu = element(by.tagName('br-credential-viewer-action-menu'));
  actionMenu.element(by.partialLinkText('Edit')).click();
  bedrock.waitForModalTransition();
  var editModal = element(by.tagName('br-edit-credential-modal'));
  var checkbox = editModal.element(by.model('model.allPublic'));
  checkbox.isSelected().then(function(selected) {
    // uncheck the box if it's selected
    if(selected) {
      checkbox.click();
    }
  });
  editModal.element(by.partialButtonText('Save')).click();
  browser.wait(EC.stalenessOf(editModal), 3000);
};

api.name = function() {
  bedrock.waitForElementToShow(api.component);
  return api.component.element(
    by.attribute('ng-bind', '$ctrl.credential.name'));
};
