/*!
 * Credential directive.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
define(['jsonld', 'underscore'], function(jsonld, _) {

'use strict';

/* @ngInject */
function factory(brAlertService, brCredentialLibraryService, config) {
  return {
    restrict: 'E',
    scope: {
      credential: '=brCredential',
      groups: '=?brGroups',
      library: '=?brLibrary',
      showActions: '=?brShowActions'
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

    var updates = [];

    scope.$watch('credential', function(credential) {
      if(!credential) {
        return;
      }
      // use an update queue to ensure model is kept in sync with
      // the latest change
      updates.push(Promise.all([
        _getGroups(credential, scope.groups, scope.library),
        _getActionables(credential, scope.showActions)])
        .then(function(results) {
          updates.pop();
          if(updates.length === 0) {
            model.credential = credential;
            model.groups = results[0];
            model.actionables = results[1];
            scope.$apply();
          }
        }));
    }, true);

    function _getGroups(credential, groups, library) {
      groups = credential.sysLayout || groups;
      if(library || !groups) {
        return brCredentialLibraryService.getLibrary(library)
          .then(function(library) {
            // pick out groups that match credential types
            var types = _.flatten(jsonld.getValues(credential, 'type'));
            return _.values(_.pick(library.groups, types));
          }).catch(function(err) {
            brAlertService.add('error', err, {scope: scope});
          });
      }
      return Promise.resolve(credential.sysLayout || groups);
    }

    function _getActionables(credential, showActions) {
      // filter out any objects with potential actions
      if(showActions) {
        return jsonld.promises.frame(credential, actionFrame)
          .then(function(framed) {
            return framed['@graph'];
          }).catch(function(err) {
            brAlertService.add('error', err, {scope: scope});
          });
      }
      return Promise.resolve([]);
    }
  }
}

return {brCredential: factory};

});
