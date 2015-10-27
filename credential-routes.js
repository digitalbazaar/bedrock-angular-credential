/*!
 * Credential Routes.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define([], function() {

var base = window.data['bedrock-angular-credential'].credentialsBasePath;
return [/*{
  path: base,
  options: {
    title: 'Credentials',
    templateUrl: requirejs.toUrl('bedrock-angular-credential/credentials.html')
  }
}, *//*{
  path: base + '/:credential',
  options: {
    title: 'Credential',
    templateUrl: requirejs.toUrl('bedrock-angular-credential/credential-viewer.html')
  }
}*/];

});
