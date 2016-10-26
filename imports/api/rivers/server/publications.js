import {Meteor} from 'meteor/meteor';
import {Rivers} from '../index';
import {Regions} from '../../regions';

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
