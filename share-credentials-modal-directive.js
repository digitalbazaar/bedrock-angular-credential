/*!
 * Share Credentials Modal.
 *
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: {
      identity: '=brIdentity',
      shareUrl: '=brShareUrl'
    },
    require: '^stackable',
    templateUrl: 'bedrock-angular-credential/share-credentials-modal.html',
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
  }
}
