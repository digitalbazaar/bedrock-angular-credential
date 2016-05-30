/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/credentials-action-menu.html')
  };
}

return {brCredentialsActionMenu: factory};

});
