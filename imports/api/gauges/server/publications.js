import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Gauges} from '../index';
import {Measurements} from '../../measurements';
import { Jobs } from '../../jobs';
import { Sources } from '../../sources';

const publicFields = {
  enabled: 0,
};

Meteor.publishComposite('gauges.inSource', function(sourceId){
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  const fields = isAdmin ? undefined : publicFields;
  let children = [];
  if (isAdmin){
    children = [
      //Source itself
      {
        find(){
          return Sources.find(sourceId);
        }
      },
      //Jobs
      {
        find(){
          return Jobs.find({ "data.sourceId": sourceId }, { fields: { status: 1, data: 1 } });
        }
      },
    ];
  }

  return {
    find() {
      new SimpleSchema({
        sourceId: {type: String}
      }).validate({ sourceId });

      return Gauges.find({sourceId}, fields);
    },
    children
  }
});

Meteor.publishComposite('gauges.details', function(gaugeId){

  new SimpleSchema({
    gaugeId: {type: String}
  }).validate({ gaugeId });

  return {
    find(){
      return Gauges.find(gaugeId);
    },
    children: [
      {
        find(){
          return Measurements.find({gaugeId});
        }
      },
    ]
  }
});