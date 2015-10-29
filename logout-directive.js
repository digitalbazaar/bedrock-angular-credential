/*!
 * Logout directive.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Matthew Collier
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory(
  $location, brAlertService, brAuthenticationService, brSessionService) {
  return {
    restrict: 'E',
    scope: {
      callback: '&?brLogoutCallback'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-credential/logout.html'),
    link: Link
  };

  function Link(scope, elem, attrs) {
    var model = scope.model = {};
    model.loggedIn = false;

    scope.$watch(function() {
      return brSessionService.session.identity;
    }, function(identity) {
      model.loggedIn = !!identity;
    });

    model.logout = function() {
      var err_ = null;
      brAuthenticationService.logout().catch(function(err) {
        err_ = err;
      }).then(function() {
        if(angular.isDefined(attrs.brLogoutCallback)) {
          return scope.callback({err: err_});
        }
        if(err_) {
          brAlertService.add('error', err_, {scope: scope});
          scope.$apply();
          return;
        }
        $location.url('/');
        scope.$apply();
      });
    };
  }
}

return {brLogout: factory};

});
