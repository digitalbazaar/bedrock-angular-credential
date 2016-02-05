/*!
 * Credential directive.
 *
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
define(['jsonld', 'lodash'], function(jsonld, _) {

'use strict';

/* @ngInject */
function factory(
  $compile, brAlertService, brCredentialService, brCredentialLibraryService,
  brFormLibraryService) {
  return {
    restrict: 'E',
    scope: {
      credential: '=brCredential',
      groups: '=?brGroups',
      library: '=?brLibrary',
      showActions: '=?brShowActions',
      options: '=brOptions'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/credential.html'),
    link: Link
  };

  function Link(scope, element) {
    var model = scope.model = {};
    model.modals = {};

    model.credential = null;
    model.credentialView = null;
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
      updates.push(_compact(credential).then(function(compacted) {
        return Promise.all([
          _getGroups(compacted, scope.groups, scope.library),
          // TODO: use compacted credential consistently?
          _getActionables(credential, scope.showActions)
        ]).then(function(results) {
          updates.pop();
          if(updates.length === 0) {
            var displayer = brCredentialService.getDisplayer(credential);
            if(model.credentialView) {
              model.credentialView.remove();
            }
            model.credential = credential;
            model.compacted = compacted;
            model.groups = results[0];
            model.actionables = results[1];

            // TODO: can this HTML be done in the view instead?
            var template;
            if(scope.options && scope.options.display === 'simple') {
              template =
                '<' + 'br-simple-credential-displayer' +
                ' br-model="model.compacted"' +
                ' br-groups="model.groups"' +
                ' br-options="' + 'options' + '"></' +
                'br-simple-credential-displayer>';
            } else {
              template =
                '<' + displayer.directive +
                ' br-model="model"' +
                ' br-options="{editable: false}"></' +
                displayer.directive + '>';
            }
            model.credentialView = $compile(template)(scope);
            element.prepend(model.credentialView);
            scope.$apply();
          }
        });
      }));
    }, true);

    // TODO: compaction should be done in br-form
    function _compact(credential) {
      return jsonld.promises.compact(credential, brFormLibraryService._CONTEXT);
    }

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
