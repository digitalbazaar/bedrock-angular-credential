/*!
 * Logout directive.
 *
 * Copyright (c) 2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Matthew Collier
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($http, $location) {
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

    model.logout = function() {
      var err_ = null;
      Promise.resolve($http.get('/consumer/logout'))
      .catch(function(err) {
        err_ = err;
      }).then(function() {
        if(angular.isDefined(attrs.brLogoutCallback)) {
          return scope.callback({err: err_});
        }
        $location.url('/');
        scope.$apply();
      });
    };
  }
}

return {brLogout: factory};

});
