/*!
 * Credential Service.
 *
 * Copyright (c) 2014-2016 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
define(['jsonld', 'lodash'], function(jsonld, _) {

'use strict';

/* @ngInject */
function factory($rootScope, brRefreshService, brResourceService, config) {
  var service = {};
  // storage for different collections
  service.collections = {};
  // map from Credential type to array of displayers
  service.displayers = {
    byId: {},
    byType: {}
  };
  service.identity = null;

  // FIXME: public access allowed so may not have an identity to use
  // FIXME: if collection tries to use url, should login and set this

  service.credentialsBasePath =
    config.data['bedrock-angular-credential'].credentialsBasePath;

  // generic collection of credentials
  service.collection = new brResourceService.Collection({
    url: service.credentialsBasePath
  });

  service.setIdentity = function(identity) {
    service.identity = identity;
    if(!identity) {
      delete service.collections.claimed;
      delete service.collections.issued;
      delete service.collections.unclaimed;
      service.credentials = {};
      service.state = service.collection.state;
      return;
    }

    // credentials claimed by current identity
    service.collections.claimed = new brResourceService.Collection({
      url:
        service.credentialsBasePath + '?filter=claimed&recipient=' +
        encodeURIComponent(service.identity.id)
    });

    // credentials issued by current identity
    service.collections.issued = new brResourceService.Collection({
      url:
        service.credentialsBasePath + '?issuer=' +
        encodeURIComponent(service.identity.id)
    });

    // unclaimed credentials where current identity is the recipient
    service.collections.unclaimed = new brResourceService.Collection({
      url:
        service.credentialsBasePath + '?filter=unclaimed&recipient=' +
        encodeURIComponent(service.identity.id)
    });

    service.credentials = {
      issued: service.collections.issued.storage,
      claimed: service.collections.claimed.storage,
      unclaimed: service.collections.unclaimed.storage
    };
    service.state = {
      issued: service.collections.issued.state,
      claimed: service.collections.claimed.state,
      unclaimed: service.collections.unclaimed.state
    };

    // register for system-wide refreshes
    brRefreshService.register(service.collections.issued);
    brRefreshService.register(service.collections.claimed);
    brRefreshService.register(service.collections.unclaimed);
  };

  service.registerDisplayer = function(displayer) {
    service.displayers.byId[displayer.id] = displayer;
    _.each(displayer.accept || {}, function(options, type) {
      service.displayers.byType[type] = displayer;
    });
  };

  service.getDisplayer = function(credential, name) {
    // FIXME: compact or frame credential?
    if(name) {
      return service.displayers.byId[name];
    }
    var types = jsonld.getValues(credential, 'type');
    // TODO: register and find displayers using priority
    // Possibly use displayer 'q' param like Accept?
    // May want to be able to override
    types = _.reject(types, function(type) { return type === 'Credential'; });
    // FIXME: can only handle single type
    if(types.length !== 1) {
      console.warn('Displaying using first type:', types);
    }
    return service.displayers.byType[types[0]] ||
      service.displayers.byId['default'];
  };

  // expose service to scope
  $rootScope.app.services.credential = service;

  return service;
}

return {brCredentialService: factory};

});
