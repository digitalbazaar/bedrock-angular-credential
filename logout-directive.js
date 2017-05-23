/*!
 * Logout directive.
 *
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Matthew Collier
 */
import angular from 'angular';

/* @ngInject */
export default function factory(
  $location, brAlertService, brAuthenticationService, brSessionService) {
  return {
    restrict: 'E',
    scope: {
      callback: '&?brLogoutCallback'
    },
    templateUrl: 'bedrock-angular-credential/logout.html',
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
