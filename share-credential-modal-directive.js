/*!
 * Share Credential Modal.
 *
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
      shareUrl: '=brShareUrl'
    },
    require: '^stackable',
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/share-credential-modal.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};

  }
}

return {brShareCredentialModal: factory};

});
