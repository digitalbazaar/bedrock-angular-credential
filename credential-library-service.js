/*!
 * Credential library service.
 *
 * Copyright (c) 2014-2015 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 * @author David I. Lehn
 * @author Matt Collier
 */
define(['angular'], function(angular) {

'use strict';

/* @ngInject */
function factory(brFormLibraryService, config) {
  var service = {};
  service.libraries = {};
  service.CONTEXT = brFormLibraryService._CONTEXT;

  service.getLibrary = function(name) {
    if(typeof name === 'undefined') {
      name = 'default';
    }

    // return cached library
    if(name in service.libraries) {
      return new Promise.resolve(service.libraries[name]);
    }

    // create library
    var library = brFormLibraryService.create({loadVocabs: false});

    // load vocabs specified in config
    var cfg = config.data['bedrock-angular-credential'];
    var libraries = (cfg && cfg.libraries);
    if(name === 'default' && !(name in libraries)) {
      vocabs = [service.DEFAULT_VOCAB];
    }
    var vocabs = (libraries && libraries[name]) || [];
    Promise.all(vocabs.map(function(vocab) {
      if(typeof vocab === 'string') {
        return brFormLibraryService.collection.get(vocab);
      }
      return Promise.resolve(vocab);
    })).then(function(vocabs) {
      return Promise.all(vocabs.map(function(vocab) {
        return library.load(vocab);
      }));
    }).then(function() {
      libraries[name] = library;
      return library;
    });
  };

  service.DEFAULT_VOCAB = {
    "@context": service.CONTEXT,
    "id": "urn:bedrock-angular-credential-vocab",
    "label": "Default Vocabulary for bedrock-angular-credential",
    "@graph": [{
      "id": "EmailCredential",
      "type": "PropertyGroup",
      "label": "Verified Email",
      "layout": [{
        "property": {
          "id": "claim",
          "type": "Property",
          "label": "Claim",
          "range": "URL",
          "collapsed": true
        },
        "propertyGroup": {
          "id": "EmailClaimPropertyGroup",
          "type": "PropertyGroup",
          "collapsed": true,
          "layout": [{
            "property": {
              "id": "email",
              "type": "Property",
              "label": "Email Address",
              "range": "String"
            }
          }]
        }
      }, {
        "property": {
          "id": "issued",
          "type": "Property",
          "label": "Date Issued",
          "range": "String"
        }
      }]
    }]
  };

  return service;
}

return {brCredentialLibraryService: factory};

});
