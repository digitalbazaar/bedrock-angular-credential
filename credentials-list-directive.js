/*!
 * Credentials directive.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory(
  $location, brAlertService, brSessionService, brCredentialService) {
  return {
    restrict: 'E',
    scope: {
      credentialType: '@brCredentialType'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/credentials-list.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.modals = {};
    model.state = {
      credentials: {loading: true}
    };

    var promise;
    model.identity = null;
    if(brCredentialService.identity) {
      promise = Promise.resolve(brCredentialService.identity);
    } else {
      promise = brSessionService.get().then(function(session) {
        if(!('identity' in session)) {
          // FIXME: handle more generally
          $location.path('/');
          scope.$apply();
          return;
        }
        return session.identity;
      });
    }

    var init = false;
    promise.then(function(identity) {
      init = true;
      if(!identity) {
        return;
      }
      model.identity = identity;
      brCredentialService.setIdentity(identity);
      _credentialTypeUpdated(scope.credentialType);

      model.sorting = {
        name: '+',
        issued: '+'
      };
      model.orderBy = ['+name', '+issued'];
    });

    model.sortClick = function(field) {
      switch(field) {
        case 'name':
          model.sorting.name = (model.sorting.name === '+') ? '-' : '+';
          model.orderBy = [
            model.sorting.name + 'name',
            model.sorting.issued + 'issued'
          ];
          break;
        case 'issued':
          model.sorting.issued = (model.sorting.issued === '+') ? '-' : '+';
          model.orderBy = [
            model.sorting.issued + 'issued',
            model.sorting.name + 'name'
          ];
          break;
      }
    };

    scope.$watch('credentialType', _credentialTypeUpdated);

    model.confirmDeleteCredential = function(err, result) {
      if(!err && result === 'ok') {
        model.modals.credential.deleted = true;
        // wait to delete so modal can transition
        brCredentialService.collection.del(
          model.modals.credential.id, {delay: 400})
          .catch(function(err) {
            brAlertService.add('error', err, {scope: scope});
            model.modals.credential.deleted = false;
            scope.$apply();
          });
      }
    };

    function _credentialTypeUpdated(value) {
      if(!init) {
        return;
      }

      if(angular.isUndefined(value) || value == 'claimed') {
        scope.credentialType = 'claimed';
        model.credentials = brCredentialService.credentials.claimed;
        model.state.credentials = brCredentialService.state.claimed;
      } else if(value === 'issued') {
        model.credentials = brCredentialService.credentials.issued;
        model.state.credentials = brCredentialService.state.issued;
      } else if(value === 'unclaimed') {
        model.credentials = brCredentialService.credentials.unclaimed;
        model.state.credentials = brCredentialService.state.unclaimed;
      } else {
        console.error('Unknown credential type:', value);
      }

      for(var key in brCredentialService.collections) {
        brCredentialService.collections[key].getAll();
      }
    }
  }
}

return {brCredentials: factory};

});
