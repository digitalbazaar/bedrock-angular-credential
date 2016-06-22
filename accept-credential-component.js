/*!
 * Accept Credential directive.
 *
 * Copyright (c) 2015-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brAcceptCredential', {
    bindings: {
      onComplete: '&brOnComplete',
      credential: '<brCredential'
    },
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/accept-credential-component.html')
  });
}

/* @ngInject */
function Ctrl($scope, brAlertService, config) {
  var self = this;
  self.identity = null;

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
      agentUrl: config.data['authorization-io'].agentUrl +
        '?op=store&route=params'
    }).then(function(identity) {
      if(identity) {
        return self.onComplete({err: null, identity: identity});
      }
      // the authio window was closed or cancelled
      brAlertService.add(
        'error', 'The credential was not properly stored.  Please try again.',
        {scope: $scope});
    }).catch(function(err) {
      self.onComplete({err: err});
    }).then(function() {
      $scope.$apply();
    });
  };

  self.rejectCredential = function() {
    self.onComplete({err: null, identity: null});
  };
}

return register;

});
