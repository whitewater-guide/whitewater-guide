import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Gauges} from '../index';
import {Measurements} from '../../measurements';
import { Jobs } from '../../jobs';
import { Sources } from '../../sources';

const publicFields = {
  disabled: 0,
};

Meteor.publish('gauges.inSource', function(source) {
  new SimpleSchema({
    source: {type: String}
  }).validate({ source });

  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  const fields = isAdmin ? undefined : publicFields;
  const result = [Gauges.find({source}, fields)];
  if (isAdmin) {
    result.push(Sources.find(source));//Source itself
    result.push(Jobs.find({ "data.source": source }, { fields: { status: 1, data: 1 } }));//Related jobs
  }
  return result;
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