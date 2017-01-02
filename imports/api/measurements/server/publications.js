import {Meteor} from 'meteor/meteor';
import {Measurements} from '../index';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import moment from 'moment';

Meteor.publish('measurements.forGauge', function (gaugeId, days) {
  new SimpleSchema({
    gaugeId: {type: String},
    days: {type: Number, min: 1, max: 31}
  }).validate({gaugeId, days});

  const startDate = moment().subtract(days, 'days').toDate();

  return Measurements.find({gaugeId, date: {$gte: startDate}});
});