/*!
 * Simple credential displayer directive.
 *
 * Can take advantage of the following options sent through brOptions:
 *
 * limit: an integer limiting the amount of properties displayed, defaults to
 *   MAX
 *
 * collapsable: a flag denoting if the properties underneath the credential can
 *   collapse and expand, if true, the properties will collapse down to
 *   whatever number is specified by 'limit'
 *
 * hideTitle: a flag that hides the credential's title, used if you only want
 *   to display credential properties
 *
 * Copyright (c) 2015-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Alex Lamar
 */
import jsonld from 'jsonld';

/* @ngInject */
export default function factory() {
  return {
    restrict: 'E',
    scope: {
      model: '=brModel',
      groups: '=brGroups',
      options: '=brOptions'
    },
    templateUrl: 'bedrock-angular-credential/simple-credential-displayer.html',
    link: Link
  };

  function Link(scope) {
    var LIMIT_DEFAULT = Infinity;
    var model = scope.model;

    model.properties = getReadableProperties(scope.model, scope.groups);
    model.hideTitle = false;
    model.limit = Infinity;
    if(scope.options) {
      if(scope.options.limit) {
        model.limit = scope.options.limit;
        LIMIT_DEFAULT = model.limit;
      }
      if(scope.options.hideTitle) {
        model.hideTitle = scope.options.hideTitle;
      }
    }

    model.expandProperties = function() {
      if(scope.options && !scope.options.collapsable) {
        // Don't allow collapsable behavior if not specified through options
        return;
      }

      if(model.limit === Infinity) {
        // Collapse
        model.limit = LIMIT_DEFAULT;
      } else {
        // Expand
        model.limit = Infinity;
      }
    };

    function getReadableProperties(model, groups) {
      var properties = [];

      if(groups.length === 0) {
        // TODO: We can probably do a better job of printing claims that do not
        // have a readable layout specified, but for now we just indicate that
        // no such layout exists
        properties.push('Failed to read credential properties');
        return properties;
      }

      if(groups[0].label) {
        model.title = groups[0].label;
      } else if(groups[0].id) {
        model.title = groups[0].id;
      } else {
        model.title = 'No Title';
      }

      parseGroups(model, groups, false);
      return properties;

      function parseGroups(model, groups) {
        for(var key in groups) {
          var group = groups[key];
          parseGroup(model, group, false);
        }
      }

      function parseGroup(model, group) {
        for(var key in group.layout) {
          var property = group.layout[key];
          var propertyId;
          var schema;
          if(property.property === 'id') {
            propertyId = 'id';
            schema = {
              label: 'ID',
              range: 'URL'
            };
          } else {
            propertyId = property.property.id;
            schema = property.property;
          }
          var range = schema.range;
          var propertyGroups = jsonld.getValues(property, 'propertyGroup');
          var value = model[propertyId];

          if(propertyGroups.length > 0) {
            parseGroups(value, propertyGroups, false);
          } else {
            // We're at a leaf value in the claim tree
            if(range === 'Date' && value) {
              value = value['@value'];
            }
            if(!value) {
              console.log('Failed to match value for group id: ' + propertyId);
              continue;
            }
            var label = schema.label;
            if(label === 'Image') {
              continue;
            }
            if(label === 'Issuer') {
              // A bit of a hack to extract issuer strings
              if('id' in value) {
                value = value.id;
              }
            }
            var line = label + ': ' + value;
            properties.push(line);
          }
        }
      }
    }
  }
}
