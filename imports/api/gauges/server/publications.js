import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Gauges} from '../index';
import {Measurements} from '../../measurements';

const publicFields = {
  disabled: 0,
};

Meteor.publish('gauges.inSource', function(source) {
  new SimpleSchema({
    source: {type: String}
  }).validate({ source });

  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  const fields = isAdmin ? undefined : publicFields;
  const selector = isAdmin ? {source} : {source, disabled: false};
  return Gauges.find(selector, fields);
});

Meteor.publish('gauges.details', function (gauge) {
  new SimpleSchema({
    gauge: {type: String}
  }).validate({ gauge });  

  return [
    Gauges.find(gauge),
    Measurements.find({gauge}),
  ];
});