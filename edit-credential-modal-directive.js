/*!
 * Edit Credential Modal.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
/* @ngInject */
export default function factory(brAlertService, brCredentialService) {
  return {
    restrict: 'E',
    scope: {
      credential: '=brCredential',
      updateUrl: '=brUpdateUrl'
    },
    require: '^stackable',
    templateUrl: 'bedrock-angular-credential/edit-credential-modal.html',
    link: Link
  };

  function Link(scope, element, attrs, stackable) {
    var model = scope.model = {};
    model.loading = false;
    model.allPublic = scope.credential.sysIsPublic || false;

    model.editCredential = function() {
      // build credential update
      var credential = {
        '@context': scope.credential['@context'],
        id: scope.credential.id,
        sysPublic: []
      };
      if(model.allPublic) {
        credential.sysPublic.push('*');
      }
      model.loading = true;
      brAlertService.clearFeedback();
      var options = {};
      if(scope.updateUrl) {
        options.url = scope.updateUrl;
      }
      brCredentialService.collection.update(credential, options)
        .then(function(credential) {
          model.loading = false;
          stackable.close(null, credential);
        })
        .catch(function(err) {
          model.loading = false;
          brAlertService.add('error', err, {scope: scope});
          scope.$apply();
        });
    };
  }
}
