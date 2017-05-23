/*!
 * Default Credential displayer directive.
 *
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author David I. Lehn
 * @author Dave Longley
 */
/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: {
      model: '=brModel',
      library: '<?brLibrary',
      options: '=brOptions'
    },
    templateUrl: 'bedrock-angular-credential/default-credential-displayer.html'
  };
}
