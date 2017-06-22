/*!
 * Credential module.
 *
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
// TODO: alphabetize
import angular from 'angular';
import AuthenticationService from './authentication-service.js';
import SimpleCredentialDisplayerDirective from
  './simple-credential-displayer-directive.js';
import CredentialActionMenuComponent from
  './credential-action-menu-component.js';
import CredentialDirective from './credential-directive.js';
import CredentialInfoModalComponent from './credential-info-modal-component.js';
import CredentialLibraryService from './credential-library-service.js';
import CredentialService from './credential-service.js';
import CredentialViewerComponent from './credential-viewer-component.js';
import CredentialsActionMenuDirective from
  './credentials-action-menu-directive.js';
import CredentialsListDirective from './credentials-list-directive.js';
import DefaultCredentialDisplayerDirective from
  './default-credential-displayer-directive.js';
import EditCredentialModalDirective from './edit-credential-modal-directive.js';
import ExportCredentialModalDirective from
  './export-credential-modal-directive.js';
import AcceptCredentialComponent from './accept-credential-component.js';
import LoginDirective from './login-directive.js';
import LogoutDirective from './logout-directive.js';
import SelectTextDirective from './select-text-directive.js';
import ShareCredentialModalDirective from
  './share-credential-modal-directive.js';
import ShareCredentialsModalDirective from
  './share-credentials-modal-directive.js';

var module = angular.module(
  'bedrock.credential', ['bedrock.alert', 'bedrock.form', 'bedrock.resource',
    'bedrock.session']);

// TODO: need widgets for:
// viewing claimed credentials
// managing ACL for pre-authorized access to credentials
// screen with pluggable credential displayer? would be nice to
//   make it replaceable so a better displayer can be used
// viewing notifications of unclaimed credentials or done as part of another
// module?

module.component('brAcceptCredential', AcceptCredentialComponent);
module.component('brCredentialViewer', CredentialViewerComponent);
module.component('brCredentialActionMenu', CredentialActionMenuComponent);
module.component('brCredentialInfoModal', CredentialInfoModalComponent);
module.service('brAuthenticationService', AuthenticationService);
module.directive('brCredential', CredentialDirective);
module.service('brCredentialLibraryService', CredentialLibraryService);
module.service('brCredentialService', CredentialService);
module.directive('brCredentialsActionMenu', CredentialsActionMenuDirective);
module.directive('brCredentialsList', CredentialsListDirective);
module.directive('brDefaultCredentialDisplayer',
  DefaultCredentialDisplayerDirective);
module.directive('brEditCredentialModal', EditCredentialModalDirective);
module.directive('brExportCredentialModal', ExportCredentialModalDirective);
// TODO: alphabetize
module.directive('brLogin', LoginDirective);
module.directive('brLogout', LogoutDirective);
module.directive('brSelectText', SelectTextDirective);
module.directive('brShareCredentialModal', ShareCredentialModalDirective);
module.directive('brShareCredentialsModal', ShareCredentialsModalDirective);
module.directive('brSimpleCredentialDisplayer',
  SimpleCredentialDisplayerDirective);

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
