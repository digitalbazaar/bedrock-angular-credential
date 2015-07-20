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
  './credential-directive'
], function(
  angular,
  credentialDirective
) {

'use strict';

var module = angular.module('bedrock.credential', []);

module.directive(credentialDirective);

return module.name;

});
