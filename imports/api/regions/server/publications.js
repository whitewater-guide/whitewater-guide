import {TAPi18n} from 'meteor/tap:i18n';
import {Regions} from '../index';
import {Points} from '../../points';
import {Meteor} from 'meteor/meteor';

TAPi18n.publish('regions.list', function (lang) {
  return Regions.find({}, {lang});
});

Meteor.publishComposite('regions.details', function (regionId, lang) {
  let children = [];
  if (regionId){
    children.push({
      find(regionDoc) {
        const pois = regionDoc.poiIds || [];
        return Points.find({_id: {$in: pois}}, {lang});
      }
    });
  }
  return {
    find() {
      return Regions.find(regionId, {limit: 1, lang});
    },
    children,
  }
});