/*!
 * Credential Info Modal.
 *
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
      credential: '=brCredential'
    },
    require: '^stackable',
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/credential-info-modal.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.loading = false;
  }
}

return {brCredentialInfoModal: factory};

});

