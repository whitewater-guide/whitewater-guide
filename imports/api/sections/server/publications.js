import {Meteor} from 'meteor/meteor';
import {Sections} from '../index';
import {Rivers} from '../../rivers';
import {Gauges} from '../../gauges';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

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

Meteor.publish('section.details', function (sectionId) {
  new SimpleSchema({
    sectionId: {type: String}
  }).validate({ sectionId });

  return Sections.find(sectionId);
});