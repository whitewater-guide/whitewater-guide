import {Meteor} from 'meteor/meteor';
import {Sections} from '../index';
import {Rivers} from '../../rivers';
import {Gauges} from '../../gauges';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';

Meteor.publishComposite('sections.list', function(riverId) {
  return {
    find: function () {
      return Sections.find({riverId});
    },

    children: [
      //River
      {
        find: function (section) {
          return Rivers.find(section.riverId, {limit: 1, fields: {name: 1}});
        }
      },
      //Gauge
      {
        find: function (section) {
          return Gauges.find(section.gaugeId, {limit: 1, fields: {name: 1}});
        }
      }
    ]
  }
});

Meteor.publish('sections.details', function (sectionId) {
  new SimpleSchema({
    sectionId: {type: String}
  }).validate({ sectionId });

  return Sections.find(sectionId);
});

/**
 * Everything we need in 'New Section' form:
 * - Name of the river where we add this section;
 * - List of gauges, found by river->region->sources->gauges
 */
Meteor.publishComposite('sections.new', function (riverId) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');

  new SimpleSchema({
    riverId: {type: String}
  }).validate({ riverId });

  return {
    find(){
      if (!isAdmin)
        return;
      return Rivers.find(riverId, {limit: 1, fields: {name: 1, regionId: 1}});
    },
    children: [
      {
        find(riverDoc){//Finds river->region->sources
          const region = riverDoc.region().fetch();
          return region[0].sources();
        },
        children: [
          {
            find(sourceDoc){//Now find gauges
              return sourceDoc.gauges({name: 1});
            }
          }
        ]
      }
    ]
  };
});