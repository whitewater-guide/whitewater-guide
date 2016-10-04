import {Meteor} from 'meteor/meteor';
import {Jobs} from '../index';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('jobs.all', function() {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  return Jobs.find({});
});

Meteor.publish('jobs.forSource', function (source) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  new SimpleSchema({
    source: {type: String}
  }).validate({ source });

  return Jobs.find({"data.source": source});
});