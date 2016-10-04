import {Meteor} from 'meteor/meteor';
import {Jobs} from '../index';
import {Roles} from 'meteor/alanning:roles';

Meteor.publish('jobs.all', function() {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  if (!isAdmin)
    return this.ready();
  return Jobs.find({});
});