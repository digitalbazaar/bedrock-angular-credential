/*!
 * Accept Credential directive.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
// TODO: remove node-uuid, temporary only
define(['node-uuid'], function(uuid) {

'use strict';

/* @ngInject */
function factory($injector, brAlertService, config) {
  function Ctrl($scope) {
    var self = this;
    self.aioBaseUri = config.data['authorization-io'].baseUri;
    self.credential = null;
    self.display = {};
    self.display.login = true;
    self.display.credential = false;
    self.display.acknowledgement = false;
    var service;

    $scope.$watch(function() {
      return self.serviceName;
    }, function(serviceName) {
      if($injector.has(serviceName)) {
        service = $injector.get(serviceName);
      }
    });

    self.login = function() {
      navigator.credentials.get({
        query: {
          '@context': 'https://w3id.org/identity/v1',
          id: '',
          publicKey: ''
        },
        // TODO: change polyfill to accept agent base URL
        agentUrl: self.aioBaseUri + '/agent?op=get&route=params'
      }).then(function(identity) {
        if(!identity || !identity.id) {
          throw new Error('DID not provided.');
        }
        // TODO: POST identity to verification service; should this be handled
        // via callback or assume presence of brConsumerService?
        self.identity = identity;
        _showCredential();
      }).catch(function(err) {
        brAlertService.add('error', err);
      }).then(function() {
        $scope.$apply();
      });
    };

    self.acceptCredential = function() {
      return navigator.credentials.store(self.credential, {
        agentUrl: self.aioBaseUri + '/agent?op=store&route=params'
      }).then(function(identity) {
        self.callback(null, identity);
      }).catch(function(err) {
        self.callback(err);
      });
    };

    self.rejectCredential = function() {
      // TODO: call $scope.callback(err)
    };

    function _showCredential() {
      // TODO: use `brCredentialService` to get credential using
      // authorization via identity credential
      var recipient = self.identity.credential[0]['@graph'].claim.id;
      service.get(recipient)
        .then(function(response) {
          self.credential = response;
          _display('credential');
        }).catch(function(err) {
          brAlertService.add('error', err);
        }).then(function() {
          $scope.$apply();
        });

    }

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
      callback: '=brAcceptCredentialCallback',
      serviceName: '@brAcceptCredentialService'
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
