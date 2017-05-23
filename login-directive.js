/*!
 * Login directive.
 *
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Matthew Collier
 */
/* @ngInject */
export default function factory(brAuthenticationService, config) {
  return {
    restrict: 'E',
    scope: {
      callback: '&brLoginCallback'
    },
    templateUrl: 'bedrock-angular-credential/login.html',
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.aioBaseUri = config.data['authorization-io'].baseUri;

    model.login = function() {
      var err_ = null;
      var identity_;
      navigator.credentials.get({
        query: {
          '@context': 'https://w3id.org/identity/v1',
          id: '',
          publicKey: ''
        },
        agentUrl: model.aioBaseUri + '/agent?op=get&route=params'
      }).then(function(identity) {
        if(!identity || !identity.id) {
          throw new Error('DID not provided.');
        }
        // POST identity for verification and to establish session
        return brAuthenticationService.login(identity);
      }).then(function(identity) {
        identity_ = identity;
      }).catch(function(err) {
        err_ = err;
      }).then(function() {
        scope.callback({err: err_, identity: identity_});
      });
    };
  }
}
