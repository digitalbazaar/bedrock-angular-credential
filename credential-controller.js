/*!
 * Credential Controller.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define(['jsonld'], function(jsonld) {

'use strict';

/* @ngInject */
function factory(
  $scope, brAlertService, brRefreshService, brCredentialService,
  brSessionService, brAuthenticationService) {
  var self = this;
  self.state = brCredentialService.state;
  self.modals = {};

  self.credential = null;
  self.storedCredential = null;
  self.allPublic = false;
  self.loading = true;

  self.display = {};
  self.display.acceptDirective = false;
  self.display.credentialInfo = false;
  self.display.login = false;
  self.display.acknowledgement = false;

  init();

  $scope.$watch(function() { return self.credential; }, function(credential) {
    if(!credential) {
      return;
    }
    self.allPublic = jsonld.hasValue(self.credential, 'sysPublic', '*');
    if(self.credential.sysDisplayContext) {
      jsonld.promises.compact(
        self.credential, self.credential.sysDisplayContext)
        .then(function(compacted) {
          self.compacted = compacted;
        }).catch(function(err) {
          brAlertService.add('error', err, {scope: $scope});
        }).then(function() {
          $scope.$apply();
        });
    }
  });

  self.afterAccept = function(err, identity) {
    if(err) {
      // error handling
    }
    self.storedCredential = identity.credential[0]['@graph'];
    self.storedCredential.sysState = 'claimed';
    var storageRequest = {
      '@context': 'https://w3id.org/identity/v1',
      id: identity.credential[0]['@graph'].id,
      sysState: 'claimed'
    };
    brCredentialService.collection.update(storageRequest)
      .then(function(result) {
        _display('acknowledgement');
      }).catch(function(err) {
        brAlertService.add('error', err, {scope: $scope});
      }).then(function() {
        $scope.$apply();
      });
  };

  self.afterLogin = function(err, identity) {
    init();
  };

  self.confirmDeleteCredential = function(err, result) {
    if(!err && result === 'ok') {
      self.credential.deleted = true;
      // wait to delete so modal can transition
      brCredentialService.collection.del(self.credential.id, {delay: 400})
        .catch(function(err) {
          brAlertService.add('error', err, {scope: $scope});
          self.credential.deleted = false;
          $scope.$apply();
        });
    }
  };

  function init() {
    brRefreshService.register($scope, function(force) {
      // delay to show loading screen to avoid quick flashes
      var opts = {
        force: !!force,
        delay: 250,
        resourceParams: ['id']
      };
      self.loading = true;
      brAlertService.clear();
      brCredentialService.collection.getCurrent(opts)
        .then(function(credential) {
          self.credential = credential;
          return brSessionService.get();
        })
        .then(function(result) {
          // FIXME: add additional condition to display login
          if(!result.identity) {
            _display('login');
            return;
          } else if(self.credential.claim.id === result.identity.id) {
            if(self.credential.sysState === 'unclaimed') {
              // the recipient is logged in, present acceptance directive
              _display('acceptDirective');
            } else {
              // the credential has already been accepted, display it
              _display('credentialInfo');
            }
          } else if(self.credential.issuer === result.identity.id) {
            // the issur is logged in, just show the credential
            _display('credentialInfo');
          } else {
            throw new Error('You are not authorized to view this credential.');
          }
        })
        .catch(function(err) {
          brAlertService.add('error', err, {scope: $scope});
          brAuthenticationService.logout();
          _display('login');
        })
        .then(function() {
          self.loading = false;
          $scope.$apply();
        });
    })();
  }

  function _display(showProperty) {
    for(var propertyName in self.display) {
      self.display[propertyName] = false;
    }
    self.display[showProperty] = true;
  }
}

return {brCredentialController: factory};

});
