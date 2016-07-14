var bedrock = global.bedrock;

var api = {};
module.exports = api;

var by = global.by;
var element = global.element;
var should = global.should;
var expect = global.expect;
var protractor = global.protractor;

api.COMPONENT_TAG = 'br-credentials';

api.credentials = function() {
  var component = element(by.tagName(api.COMPONENT_TAG));
  bedrock.waitForElementToShow(component);

  var credentials =
    element.all(by.repeater('credential in model.credentials'));
  return credentials;
};

api.clickCredential = function(credential) {
  credential.element(by.tagName('a')).click();
};

api.credentialLink = function(credential) {
  return credential.element(by.tagName('a')).getAttribute('href');
};
