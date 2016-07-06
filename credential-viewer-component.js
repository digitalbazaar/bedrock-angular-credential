/*!
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['jsonld'], function(jsonld) {

'use strict';

function register(module) {
  module.component('brCredentialViewer', {
    bindings: {
      onInit: '&?brOnInit'
    },
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/credential-viewer-component.html'),
    transclude: {
      'actionMenu': '?brCredentialViewerActionMenu'
    }
  });
}

/* @ngInject */
function Ctrl(
  $scope, $route, $transclude, brAlertService, brCredentialService,
  brSessionService, brAuthenticationService, config) {
  var self = this;
  self.state = brCredentialService.state;
  self.modals = {};

  self.altUpdateEndpoint = null;
  self.credentialUpdateUrl = null;
  self.credentialShareUrl = null;
  self.credential = null;
  self.storedCredential = null;
  self.allPublic = false;
  self.loading = true;
  self.allowEdit = false;

  self.display = {
    acceptDirective: false,
    credentialInfo: false,
    login: false,
    acknowledgement: false
  };

  if(config.data['angular-credential'] &&
    config.data['angular-credential'].altUpdateEndpoint) {
    self.altUpdateEndpoint =
      config.data.baseUri + config.data['angular-credential'].altUpdateEndpoint;
  }

  self.$onInit = function() {
    if(typeof self.onInit === 'function') {
      // expose controller
      self.onInit({controller: self});
    }
  };

  init();

  $scope.$watch(function() { return self.credential; }, function(credential) {
    if(!credential) {
      return;
    }
    if(!compareHost(credential.id)) {
      self.credentialUpdateUrl = brCredentialService.credentialsBasePath +
        '?id=' + encodeURIComponent(credential.id);
      self.credentialShareUrl = config.data.baseUri + self.credentialUpdateUrl;
    } else {
      self.credentialUpdateUrl = null;
      self.credentialShareUrl = credential.id;
    }
    self.allPublic = jsonld.hasValue(self.credential, 'sysPublic', '*');
  });

  self.acceptComplete = function(err, identity) {
    var updateRequest;
    var credentialServiceOptions = {};
    if(err) {
      brAlertService.add('error', err);
      $scope.$apply();
      return;
    }
    if(identity === null) {
      // rejected
      updateRequest = {
        '@context': 'https://w3id.org/identity/v1',
        id: self.credential.id,
        sysState: 'rejected'
      };
      if(!compareHost(updateRequest.id)) {
        credentialServiceOptions.url = self.altUpdateEndpoint + '?id=' +
          updateRequest.id;
      }
      brCredentialService.collection.update(
        updateRequest, credentialServiceOptions)
        .then(function(result) {
          _display('rejected');
        }).catch(function(err) {
          brAlertService.add('error', err, {scope: $scope});
        }).then(function() {
          $scope.$apply();
        });
      return;
    }
    self.storedCredential = identity.credential[0]['@graph'];
    self.storedCredential.sysState = 'claimed';
    updateRequest = {
      '@context': 'https://w3id.org/identity/v1',
      id: identity.credential[0]['@graph'].id,
      sysState: 'claimed'
    };
    if(!compareHost(updateRequest.id)) {
      credentialServiceOptions.url = self.altUpdateEndpoint + '?id=' +
        updateRequest.id;
    }
    brCredentialService.collection.update(
      updateRequest, credentialServiceOptions)
      .then(function(result) {
        _display('acknowledgement');
      }).catch(function(err) {
        brAlertService.add('error', err, {scope: $scope});
      }).then(function() {
        $scope.$apply();
      });
  };

  self.afterLogin = function(err, identity) {
    $route.reload();
  };

  self.confirmDeleteCredential = function(err, result) {
    var credentialServiceOptions = {};
    if(!compareHost(self.credential.id)) {
      credentialServiceOptions.url = self.altUpdateEndpoint + '?id=' +
        encodeURIComponent(self.credential.id);
    }
    if(!err && result === 'ok') {
      self.credential.deleted = true;
      brCredentialService.collection
        .del(self.credential.id, credentialServiceOptions)
        .catch(function(err) {
          brAlertService.add('error', err, {scope: $scope});
          self.credential.deleted = false;
        })
        .then(function() {
          $scope.$apply();
        });
    }
  };

  self.encodeUrl = function(url) {
    return encodeURIComponent(url);
  };

  self.isTranscludeSlotFilled = function(slot) {
    return $transclude.isSlotFilled(slot);
  };

  function init() {
    var session = null;
    self.loading = true;
    brAlertService.clear();
    brSessionService.get()
      .then(function(result) {
        session = result;
        // delay to show loading screen to avoid quick flashes
        var opts = {
          delay: 250,
          resourceParams: ['id']
        };
        return brCredentialService.collection.getCurrent(opts);
      }).then(function(credential) {
        self.credential = credential;
        if(!('identity' in session) && self.credential.sysIsPublic) {
          // display a public credential to a non-authenticated user
          _display('credentialInfo');
        } else if('sysPermissionTable' in session.identity &&
          'CREDENTIAL_ADMIN' in session.identity.sysPermissionTable) {
          // an admin is logged in, just show the credential
          _display('credentialInfo');
        } else if(self.credential.claim.id === session.identity.id) {
          if(self.credential.sysState === 'unclaimed') {
            // the recipient is logged in, present acceptance directive
            _display('acceptDirective');
          } else {
            // the credential has already been accepted, display it
            self.allowEdit = true;
            _display('credentialInfo');
          }
        } else if(self.credential.issuer === session.identity.id) {
          // the issuer is logged in, just show the credential
          _display('credentialInfo');
        }
      }).catch(function(err) {
        // FIXME difficult to see error dispaly due to logout below
        console.error(err);
        if('type' in err && err.type === 'NotFound' &&
          'identity' in session) {
          err.message =
            'Credential not found. Please make sure you signed in with the ' +
            'correct identity.';
          brAlertService.add('error', err, {scope: $scope});
        }
        brAuthenticationService.logout();
        _display('login');
      }).then(function() {
        self.loading = false;
        $scope.$apply();
      });
  }

  function _display(showProperty) {
    for(var propertyName in self.display) {
      self.display[propertyName] = false;
    }
    self.display[showProperty] = true;
  }

  function compareHost(url) {
    return url.indexOf(config.data.baseUri) === 0;
  }
}

return register;

});
