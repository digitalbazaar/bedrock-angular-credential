/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/credential-action-menu.html')
  };
}

return {brCredentialActionMenu: factory};
});
