import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {Sources} from '../index';

const publicFields = {
  script: 0,
  interval: 0,
  harvestMode: 0,
};

Meteor.publish('sources.list', function() {
  const fields = Roles.userIsInRole(this.userId, 'admin') ? {} : publicFields;
  return Sources.find(fields);
});