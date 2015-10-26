/*!
 * Authentication Service.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($http) {
  var service = {};

  /**
   * Attempts to authenticate the given identity.
   *
   * @param identity the signed identity to authenticate; it must be signed
   *          for the current domain.
   *
   * @return a Promise that resolves to a JSON object containing the
   *    authenticated identity, and a set of credential verification
   *    information.
   */
  service.authenticate = function(identity) {
    // POST identity for verification
    // TODO: make URL configurable
    return Promise.resolve($http.post('/consumer/authenticate', identity))
      .then(function(response) {
        return response.data;
      });
  };

  /**
   * Attempts to authenticate the given identity and create a login session.
   *
   * @param identity the signed identity to authenticate; it must contain at
   *          least a CryptographicKeyCredential and be signed for the
   *          current domain.
   *
   * @return a Promise that resolves to the authenticated identity or an error.
   */
  service.login = function(identity) {
    // POST identity for verification and to establish session
    // TODO: make URL configurable
    return Promise.resolve($http.post('/consumer/login', identity))
      .then(function(response) {
        return response.data;
      });
  };

  return service;
}

return {brAuthenticationService: factory};

});
