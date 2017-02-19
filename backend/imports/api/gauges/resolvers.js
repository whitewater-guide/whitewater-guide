import {Sources} from '../sources';
import {Measurements} from '../measurements';
import {Gauges} from './collection';
import * as methods from './methods';
import _ from 'lodash';

const publicFields = {
  code: 0,
  requestParams: 0,
  cron: 0,
  enabled: 0,
};

function upsertGauge(root, data) {
  return methods.upsertGauge(data);
}

function setGaugesEnabled(root, {enabled, ...query}) {
  if (!query._id && !query.sourceId)
    throw new Error('Either gauge or source id must be provided');
  //Server hook is used to start/stop jobs
  Gauges.update(query, {$set: {enabled}}, {multi: true});
  return Gauges.find(query, {fields: {enabled: 1}});
}

function removeGauges(root, {disabledOnly, ...query}){
  if (!query._id && !query.sourceId)
    throw new Error('Either gauge or source id must be provided');
  if (disabledOnly)
    query.enabled = false;
  return Gauges.remove(query);
}

export const gaugesResolvers = {
  Query: {
    gauges: (root, {sourceId, language, skip = 0, limit = 10}, context) => {
      const query = sourceId ? {sourceId} : {};
      const fields = context.isAdmin ? undefined : publicFields;
      limit = _.clamp(limit, 10, 100);
      return Gauges.find(query, {fields, sort: {name: 1}, lang: language, skip, limit});
    },
    gauge: (root, {_id, language}, context) => {
      const fields = context.isAdmin ? undefined : publicFields;
      let result = Gauges.findOne({_id}, {fields, lang: language});
      return result;
    },
    countGauges: (root, {sourceId}) => Gauges.find({sourceId}).count(),
  },
  Mutation: {
    upsertGauge,
    removeGauges,
    setGaugesEnabled,
  },
  Gauge: {
    source: (gauge) => Sources.findOne(gauge.sourceId),
    measurements: (gauge, {startDate, endDate}) => {
      return Measurements.find({gaugeId: gauge._id, date: {$gte: startDate, $lt: endDate}})
    },
  },
};