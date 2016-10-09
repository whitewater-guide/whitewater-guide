import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {Sources} from '../index';

const publicFields = {
  script: 0,
  interval: 0,
  harvestMode: 0,
};

Meteor.publish('sources.list', function() {
  const fields = Roles.userIsInRole(this.userId, 'admin') ? undefined : publicFields;
  return Sources.find({}, {fields});
});

Meteor.publish('sources.details', function (sourceId) {
    const fields = Roles.userIsInRole(this.userId, 'admin') ? undefined : publicFields;
  return Sources.find(sourceId, {fields});
});