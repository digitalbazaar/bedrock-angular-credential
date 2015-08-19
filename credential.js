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
  './credential-directive',
  './credential-library-service'
], function(
  angular,
  credentialDirective,
  credentialLibraryService
) {

'use strict';

var module = angular.module('bedrock.credential', []);

module.directive(credentialDirective);
module.service(credentialLibraryService);

return module.name;

});
