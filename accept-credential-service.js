/*!
 * Accept Credential service.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 */
 define([], function() {

 'use strict';

 /* @ngInject */
 function factory($injector, $rootScope, brRefreshService) {
   var service = {};

   // NOTE: the injected service have methods: verify, get
   service.AAAAA = null;
   if($injector.has('brBBBBB')) {
     service.AAAAA = $injector.get('brBBBBB');
   }

   // expose service to scope
   $rootScope.app.services.credential = service;

   return service;
 }

 return {brAcceptCredentialService: factory};

 });
