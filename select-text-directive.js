/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* @ngInject */
export default function factory($timeout) {
  return {
    restrict: 'A',
    scope: {
      trigger: '@brSelectText'
    },
    link: Link
  };

  function Link(scope, element) {
    scope.$watch('trigger', function(value) {
      if(value === 'true') {
        $timeout(function() {
          element[0].select();
        });
      }
    });
    element.on('focus', function() {
      this.select();
    });
  }
}
