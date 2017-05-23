/*!
 * Credentials directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
import angular from 'angular';
import jsonld from 'jsonld';

/* @ngInject */
export default function factory(
  $location, brAlertService, brCredentialService, config) {
  return {
    restrict: 'E',
    scope: {
      credentialType: '@brCredentialType',
      identity: '<brIdentity',
      showHeadline: '<?brShowHeadline',
      showPublicIndicator: '<?brShowPublicIndicator'
    },
    templateUrl: 'bedrock-angular-credential/credentials-list.html',
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.modals = {};
    model.state = {
      credentials: {loading: true}
    };
    model.showHeadline = scope.showHeadline !== false;
    model.showPublicIndicator = scope.showPublicIndicator !== false;

    if(scope.identity.sysSlug) {
      // enough info available to generate URL
      model.credentialsShareUrl =
        config.data.baseUri +
        config.data['bedrock-angular-credential'].identityBasePath + '/' +
        encodeURI(scope.identity.sysSlug);
    } else {
      // default to location
      // FIXME: this requires the component be used at a proper identity URL
      model.credentialsShareUrl = config.data.baseUri + $location.url();
    }
    scope.$watch('identity', function(identity) {
      brCredentialService.setIdentity(identity);
      _credentialTypeUpdated(scope.credentialType);
    });

    model.sorting = {
      name: '+',
      issued: '+',
      recipient: '+'
    };
    model.orderBy = ['+name', '+issued', '+recipient'];

    model.isPublic = function(credential) {
      return jsonld.hasValue(credential, 'sysPublic', '*');
    };

    model.sortClick = function(field) {
      switch(field) {
        case 'name':
          model.sorting.name = (model.sorting.name === '+') ? '-' : '+';
          model.orderBy = [
            model.sorting.name + 'name',
            model.sorting.issued + 'issued',
            model.sorting.recipient + 'recipient'
          ];
          break;
        case 'issued':
          model.sorting.issued = (model.sorting.issued === '+') ? '-' : '+';
          model.orderBy = [
            model.sorting.issued + 'issued',
            model.sorting.name + 'name',
            model.sorting.recipient + 'recipient'
          ];
          break;
        case 'recipient':
          model.sorting.recipient =
            (model.sorting.recipient === '+') ? '-' : '+';
          model.orderBy = [
            model.sorting.recipient + 'recipient',
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
      if(angular.isUndefined(value) || value === 'claimed') {
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
