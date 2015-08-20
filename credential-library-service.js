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
      return Promise.resolve(service.libraries[name]);
    }

    // create library
    var library = brFormLibraryService.create({loadVocabs: false});

    // load vocabs specified in config
    var cfg = config.data['bedrock-angular-credential'];
    var libraries = (cfg && cfg.libraries) || {};
    var vocabs;
    if(!(name in libraries)) {
      vocabs = (name === 'default') ? [service.DEFAULT_VOCAB] : [];
    } else {
      vocabs = libraries[name].vocabs || [];
    }
    return Promise.all(vocabs.map(function(vocab) {
      if(typeof vocab === 'string') {
        return library.load(vocab);
      }
      return library.load(vocab.id, {vocab: vocab});
    })).then(function() {
      service.libraries[name] = library;
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
          "id": "http://w3id.org/credentials#claim",
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
              "id": "schema:email",
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
          "range": "Date"
        }
      }]
    }]
  };

  return service;
}

return {brCredentialLibraryService: factory};

});
