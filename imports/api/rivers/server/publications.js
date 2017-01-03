import {Meteor} from 'meteor/meteor';
import {Rivers} from '../index';
import {Regions} from '../../regions';
import {Sections} from '../../sections';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Counts} from 'meteor/tmeasday:publish-counts';

Meteor.publishComposite('rivers.list', function(regionId, limit = 10, lang) {
  return {
    find: function () {
      const query = {};
      if (regionId)
        query.regionId = regionId;
      Counts.publish(this, `counter.rivers.${regionId}`, Rivers.find(query), {noReady: true});
      return Rivers.find(query, {lang, limit, sort: {name: 1}});
    },

    children: [
      //Region
      {
        find: function (river) {
          return Regions.find(river.regionId, {lang, limit: 1, fields: {name: 1}});
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
        find: function(riverDoc){
          return Sections.find({riverId: riverDoc._id}, {lang});
        }
      },
    ]
  };
});