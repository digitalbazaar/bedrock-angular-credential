/*!
 * Default Credential displayer directive.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
define([], function() {

'use strict';

/* @ngInject */
function factory(brCredentialService) {
  return {
    restrict: 'E',
    scope: {
      model: '=brModel',
      options: '=brOptions'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/default-credential-displayer.html')
  };
}

return {brDefaultCredentialDisplayer: factory};

});
