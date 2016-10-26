import {Meteor} from 'meteor/meteor';
import {Rivers} from '../index';
import {Regions} from '../../regions';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

Meteor.publishComposite('rivers.list', function() {
  return {
    find: function () {
      return Rivers.find({});
    },

    children: [
      {
        find: function (river) {
          return Regions.find(river.regionId, {limit: 1, fields: {name: 1}});
        }
      }
    ]
  }
});

Meteor.publish('rivers.details', function (riverId) {
  new SimpleSchema({
    riverId: {type: String}
  }).validate({ riverId });

  return Rivers.find(riverId);
});