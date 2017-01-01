import {Images} from '../index';
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';

Meteor.publish('images.all', function () {
  if (Roles.userIsInRole(this.userId, 'admin'))
    return Images.find().cursor;
  else
    return this.ready();
});