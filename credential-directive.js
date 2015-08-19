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

    scope.$watch('credential', function(credential) {
      if(!credential) {
        return;
      }
      // TODO: use bindToController in directive definition above instead
      model.credential = credential;

      // FIXME: running async code here can cause race conditions such that
      // the model isn't in sync with itself
      model.groups = [];
      model.actionables = [];
      Promise.all([_updateGroups(), _updateActionables()]).then(function() {
        scope.$apply();
      });
    }, true);

    function _updateGroups() {
      var groups = model.credential.sysLayout || scope.groups;
      var promise;
      if(scope.library || !groups) {
        promise = brCredentialLibraryService.getLibrary(scope.library)
          .then(function(library) {
            // pick out groups that match credential types
            var types = _.flatten(jsonld.getValues(model.credential, 'type'));
            return _.values(_.pick(library.groups, types));
          }).catch(function(err) {
            brAlertService.add('error', err, {scope: scope});
          });
      } else {
        promise = Promise.resolve(model.credential.sysLayout || scope.groups);
      }
      return promise.then(function(groups) {
        model.groups = groups;
      });
    }

    function _updateActionables() {
      var promise;

      // filter out any objects with potential actions
      if(scope.showActions) {
        promise = jsonld.promises.frame(model.credential, actionFrame)
          .then(function(framed) {
            return framed['@graph'];
          }).catch(function(err) {
            brAlertService.add('error', err, {scope: scope});
          });
      } else {
        promise = Promise.resolve([]);
      }

      return promise.then(function(actionables) {
        model.actionables = actionables;
      });
    }
  }
}

return {brCredential: factory};

});
