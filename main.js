/*!
 * Credential module.
 *
 * Copyright (c) 2012-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
// TODO: alphabetize
define([
  'angular',
  './authentication-service',
  './simple-credential-displayer-directive',
  './credential-action-menu-component',
  './credential-directive',
  './credential-info-modal-component',
  './credential-library-service',
  './credential-routes',
  './credential-service',
  './credential-viewer-component',
  './credentials-action-menu-directive',
  './credentials-list-directive',
  './default-credential-displayer-directive',
  './edit-credential-modal-directive',
  './export-credential-modal-directive',
  './accept-credential-component',
  './login-directive',
  './logout-directive',
  './select-text-directive',
  './share-credential-modal-directive',
  './share-credentials-modal-directive'
], function(
  angular,
  authenticationService,
  simpleCredentialDisplayerDirective,
  credentialActionMenuComponent,
  credentialDirective,
  credentialInfoModalComponent,
  credentialLibraryService,
  routes,
  credentialService,
  credentialViewerComponent,
  credentialsActionMenuDirective,
  credentialsListDirective,
  defaultCredentialDisplayerDirective,
  editCredentialModalDirective,
  exportCredentialModalDirective,
  acceptCredentialComponent,
  loginDirective,
  logoutDirective,
  selectTextDirective,
  shareCredentialModalDirective,
  shareCredentialsModalDirective
) {

'use strict';

var module = angular.module(
  'bedrock.credential', ['bedrock.alert', 'bedrock.session']);

// TODO: need widgets for:
// viewing claimed credentials
// managing ACL for pre-authorized access to credentials
// screen with pluggable credential displayer? would be nice to
//   make it replaceable so a better displayer can be used
// viewing notifications of unclaimed credentials or done as part of another
// module?

acceptCredentialComponent(module);
credentialViewerComponent(module);
credentialActionMenuComponent(module);
credentialInfoModalComponent(module);
module.service(authenticationService);
module.directive(credentialDirective);
module.service(credentialLibraryService);
module.service(credentialService);
module.directive(credentialsActionMenuDirective);
module.directive(credentialsListDirective);
module.directive(defaultCredentialDisplayerDirective);
module.directive(editCredentialModalDirective);
module.directive(exportCredentialModalDirective);
// TODO: alphabetize
module.directive(loginDirective);
module.directive(logoutDirective);
module.directive(selectTextDirective);
module.directive(shareCredentialModalDirective);
module.directive(shareCredentialsModalDirective);
module.directive(simpleCredentialDisplayerDirective);

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
