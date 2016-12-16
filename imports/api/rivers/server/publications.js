import {Meteor} from 'meteor/meteor';
import {Rivers} from '../index';
import {Regions} from '../../regions';
import {Sections} from '../../sections';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

Meteor.publishComposite('rivers.list', function() {
  return {
    find: function () {
      return Rivers.find({});
    },

    children: [
      //Region
      {
        find: function (river) {
          return Regions.find(river.regionId, {limit: 1, fields: {name: 1}});
        }
      },
    ]
  };
});

Meteor.publishComposite('rivers.details', function (riverId, lang) {
  return {
    find: function(){
      new SimpleSchema({
        riverId: {type: String, optional: true}
      }).validate({ riverId });

      return Rivers.find(riverId, {lang, limit: 1});
    },
    children: [
      //Sections
      {
        find: function(){
          return Sections.find({riverId}, {lang});
        }
      },
    ]
  };
});