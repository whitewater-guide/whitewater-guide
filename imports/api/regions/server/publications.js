import {Meteor} from 'meteor/meteor';
import {Regions} from '../index';

Meteor.publish('regions.list', function() {
  return Regions.find({});
});
