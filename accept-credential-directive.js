/*!
 * Accept Credential directive.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($injector, brAlertService, config) {
  function Ctrl($scope) {
    var self = this;
    self.aioBaseUri = config.data['authorization-io'].baseUri;
    self.display = {};
    self.display.credential = true;
    self.display.acknowledgement = false;
    self.identity = null;
    var service;

    $scope.$watch(function() {
      return self.credential;
    }, function(credential) {
      if(credential) {
        self.identity = {
          '@context': 'https://w3id.org/identity/v1',
          id: credential.claim.id,
          credential: [
            {
              '@graph': credential
            }
          ]
        };
      }
    });

    self.acceptCredential = function() {
      return navigator.credentials.store(self.identity, {
        agentUrl: self.aioBaseUri + '/agent?op=store&route=params'
      }).then(function(identity) {
        self.callback({err: null, identity: identity});
      }).catch(function(err) {
        self.callback({err: err});
      });
    };

    self.rejectCredential = function() {
      self.callback({err: null, identity: null});
    };

    function _display(showProperty) {
      for(var propertyName in self.display) {
        self.display[propertyName] = false;
      }
      self.display[showProperty] = true;
    }
  }

  return {
    restrict: 'E',
    scope: {
      callback: '&brAcceptCredentialCallback',
      credential: '=brCredential'
    },
    controller: Ctrl,
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/accept-credential.html')
  };
}

return {brAcceptCredential: factory};

});
