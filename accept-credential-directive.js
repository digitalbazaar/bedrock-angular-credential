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
    self.credential = null;
    self.display = {};
    self.display.credential = false;
    self.display.acknowledgement = false;
    var service;

    _showCredential();

    $scope.$watch(function() {
      return self.serviceName;
    }, function(serviceName) {
      if($injector.has(serviceName)) {
        service = $injector.get(serviceName);
      }
    });

    self.acceptCredential = function() {
      return navigator.credentials.store(self.credential, {
        agentUrl: self.aioBaseUri + '/agent?op=store&route=params'
      }).then(function(identity) {
        self.callback()(null, identity);
      }).catch(function(err) {
        self.callback()(err);
      });
    };

    self.rejectCredential = function() {
      // TODO: call $scope.callback(err)
    };

    function _showCredential() {
      // FIXME: correct credentialId
      var credentialId = $location.url();
      service.get(credentialId)
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
      callback: '&brAcceptCredentialCallback',
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
