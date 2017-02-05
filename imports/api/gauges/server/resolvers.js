import {Sources} from '../../sources';
import {Gauges, createGauge, editGauge, removeGauges, setEnabled} from '../index';
import {Roles} from 'meteor/alanning:roles';
import _ from 'lodash';

const publicFields = {
  code: 0,
  requestParams: 0,
  cron: 0,
  enabled: 0,
};

export default {
  Query: {
    gauges: (root, {sourceId, language, skip = 0, limit = 10}, context) => {
      const query = sourceId ? {sourceId} : {};
      const fields = Roles.userIsInRole(context.userId, 'admin') ? undefined : publicFields;
      limit = _.clamp(limit, 10, 100);
      return Gauges.find(query, {fields, sort: {name: 1}, lang: language, skip, limit});
    },
    gauge: (root, {_id, language}, context) => {
      const fields = Roles.userIsInRole(context.userId, 'admin') ? undefined : publicFields;
      return Gauges.findOne({_id}, {fields, lang: language})
    },
    countGauges: (root, {sourceId}) => Gauges.find({sourceId}).count(),
  },
  Mutation: {
    createGauge: (root, {gauge}, context) => {
      const _id = createGauge._execute(context, {data: gauge});
      return Gauges.findOne(_id);
    },
    editGauge: (root, {gauge, language}, context) => {
      editGauge._execute(context, {data: gauge, language});
      return Gauges.findOne(gauge._id);
    },
    removeGauges: (root, args, context) => {
      return removeGauges._execute(context, args);
    },
    setGaugesEnabled: (root, args, context) => {
      setEnabled._execute(context, args);
      return Gauges.find(args, {fields: {enabled: 1}});
    },
  },
  Gauge: {
    source: (gauge) => Sources.findOne(gauge._id),
  },
}