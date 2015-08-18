/*!
 * Credential directive.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
define(['jsonld'], function(jsonld) {

'use strict';

/* @ngInject */
function factory(brAlertService, config) {
  return {
    restrict: 'E',
    scope: {
      credential: '=brCredential',
      groups: '=brGroups',
      showActions: '=brShowActions'
    },
    templateUrl: requirejs.toUrl('bedrock-angular-credential/credential.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.modals = {};

    model.credential = null;
    model.actionables = [];

    var actionFrame = {
      '@context': 'https://w3id.org/credentials/v1',
      'schema:potentialAction': {}
    };

    scope.$watch('credential', function(credential) {
      if(!credential) {
        return;
      }
      model.credential = credential;
      model.groups = credential.sysLayout || scope.groups;

      // filter out any objects with potential actions
      model.actionables = [];
      if(scope.showActions) {
        jsonld.promises.frame(credential, actionFrame)
          .then(function(framed) {
            model.actionables = framed['@graph'];
          })
          .catch(function(err) {
            brAlertService.add('error', err, {scope: scope});
          })
          .then(function() {
            scope.$apply();
          });
      }
    }, true);
  }
}

return {brCredential: factory};

});
