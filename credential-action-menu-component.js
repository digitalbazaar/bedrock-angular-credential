/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brCredentialActionMenu', {
    bindings: {
      credentialViewer: '<brCredentialViewer'
    },
    templateUrl: requirejs.toUrl(
     'bedrock-angular-credential/credential-action-menu-component.html')
  });
}

return register;

});
