import {Meteor} from 'meteor/meteor';
import {Measurements} from '../index';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

Meteor.publish('measurements.forGauge', function (gaugeId, domain) {
  new SimpleSchema({
    gaugeId: {type: String},
    domain: {type: [Date]}
  }).validate({gaugeId, domain});

  return Measurements.find({gaugeId, date: {$gte: domain[0], $lt: domain[1]}});
});