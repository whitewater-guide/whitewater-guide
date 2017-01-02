import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Gauges} from '../index';
import {Jobs} from '../../jobs';
import {Sources} from '../../sources';
import {TAPi18n} from 'meteor/tap:i18n';

const publicFields = {
  enabled: 0,
};

Meteor.publishComposite('gauges.inSource', function (sourceId, limit = 10) {
  const isAdmin = Roles.userIsInRole(this.userId, 'admin');
  const fields = isAdmin ? undefined : publicFields;
  let children = [];
  if (isAdmin) {
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
          return Jobs.find({"data.sourceId": sourceId}, {fields: {status: 1, data: 1}});
        }
      },
    ];
  }

  if (!sourceId)
    return {
      find: function () {
      }
    };

  return {
    find() {
      new SimpleSchema({
        sourceId: {type: String},
        limit: {type: Number}
      }).validate({sourceId, limit});

      Counts.publish(this, `counter.gauges.${sourceId}`, Gauges.find({sourceId}), {noReady: true});
      return Gauges.find({sourceId}, {fields, limit, sort: {name: 1}});
    },
    children
  }
});

TAPi18n.publish('gauges.details', function (gaugeId, lang) {
  new SimpleSchema({
    gaugeId: {type: String, optional: true}
  }).validate({gaugeId});

  return Gauges.find(gaugeId, {lang, limit: 1});
});