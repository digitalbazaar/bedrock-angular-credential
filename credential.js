/*!
 * Credential module.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define([
  'angular',
  './authentication-service',
  './credential-controller',
  './credential-directive',
  './credential-library-service',
  './credential-routes',
  './credential-service',
  './credentials-list-directive',
  './default-credential-displayer-directive',
  './edit-credential-modal-directive',
  './export-credential-modal-directive',
  './accept-credential-directive',
  './login-directive',
  './logout-directive'
], function(
  angular,
  authenticationService,
  credentialController,
  credentialDirective,
  credentialLibraryService,
  routes,
  credentialService,
  credentialsListDirective,
  defaultCredentialDisplayerDirective,
  editCredentialModalDirective,
  exportCredentialModalDirective,
  acceptCredentialDirective,
  loginDirective,
  logoutDirective
) {

'use strict';

var module = angular.module('bedrock.credential', []);

// TODO: need widgets for:
// viewing claimed credentials
// managing ACL for pre-authorized access to credentials
// screen with pluggable credential displayer? would be nice to
//   make it replaceable so a better displayer can be used
// viewing notifications of unclaimed credentials or done as part of another
// module?

module.service(authenticationService);
module.controller(credentialController);
module.directive(credentialDirective);
module.service(credentialLibraryService);
module.service(credentialService);
module.directive(credentialsListDirective);
module.directive(defaultCredentialDisplayerDirective);
module.directive(editCredentialModalDirective);
module.directive(exportCredentialModalDirective);
module.directive(acceptCredentialDirective);
module.directive(loginDirective);
module.directive(logoutDirective);

/* @ngInject */
module.config(function($routeProvider) {
  angular.forEach(routes, function(route) {
    $routeProvider.when(route.path, route.options);
  });
});

/* @ngInject */
module.run(function(brCredentialService) {
  brCredentialService.registerDisplayer({
    id: 'default',
    accept: {
      '*': {}
    },
    directive: 'br-default-credential-displayer'
  });
});

return module.name;

});
