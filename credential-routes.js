/*!
 * Credential Routes.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
define([], function() {

return [{
  path: window.data['bedrock-angular-credential'].credentialsBasePath,
  options: {
    title: 'Credentials',
    templateUrl: requirejs.toUrl('bedrock-angular-credential/credentials.html')
  }
}];

});
