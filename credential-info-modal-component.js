/*!
 * Credential Info Modal.
 *
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brCredentialInfoModal', {
    bindings: {
      credential: '<brCredential'
    },
    require: {
      stackable: '^'
    },
    templateUrl: requirejs.toUrl(
     'bedrock-angular-credential/credential-info-modal-component.html')
  });
}

return register;

});
