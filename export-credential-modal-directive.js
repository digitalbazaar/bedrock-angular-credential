/*!
 * Export Credential Modal.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 */
import angular from 'angular';

/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: {credential: '=brCredential'},
    require: '^stackable',
    templateUrl: 'bedrock-angular-credential/export-credential-modal.html',
    link: Link
  };

  function Link(scope, element, attrs, stackable) {
    var model = scope.model = {};
    model.loading = false;
    // exportType in [jsonld, ...]
    model.exportType = 'jsonld';
    model.exportJsonLd = angular.toJson(scope.credential, true);

    var defaultRows = 20;

    model.exportJsonLdRows = defaultRows;

    scope.$watch('model.exportJsonLd', function(value) {
      if(value) {
        model.exportJsonLdRows = value.split('\n').length;
      } else {
        model.exportJsonLdRows = defaultRows;
      }
    });

    /* TODO
    scope.$watch('model.exportType', function(value) {
      if(value === '...') {
        // load and display export data
        // ...
      }
    });
    */

    function exportJsonLd() {
      stackable.close();
    }

    model.exportCredential = function() {
      switch(model.exportType) {
        case 'jsonld':
          return exportJsonLd();
      }
    };
  }
}
