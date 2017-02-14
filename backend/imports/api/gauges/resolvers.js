import {Sources} from '../sources';
import {Measurements} from '../measurements';
import {Gauges} from './collection';
import {Roles} from 'meteor/alanning:roles';
import {Points} from "../points";
import {Jobs} from "../jobs";
import _ from 'lodash';

const publicFields = {
  code: 0,
  requestParams: 0,
  cron: 0,
  enabled: 0,
};

//TODO: Admin method!!
function upsertGauge(root, {gauge: {_id, location, requestParams, ...gauge}, language}, context) {
  const hasJobs = !!_id && Jobs.find({
      "data.gauge": _id,
      status: {$in: ['running', 'ready', 'waiting', 'paused']}
    }).count() > 0;
  if (hasJobs)
    throw new Error('Cannot edit gauge which has running jobs');

  if (requestParams)
    gauge.requestParams = JSON.parse(requestParams);
  if (location) {
    gauge.location = Points.upsertTranslations(location._id, {
      [language]: {
        ...location,
        kind: 'gauge',
        name: 'Gauge: ' + gauge.name
      }
    });
  }

  if (_id)
    Gauges.updateTranslations(_id, {[language]: gauge});
  else
    _id = Gauges.insertTranslations(gauge);
  return Gauges.findOne(_id);
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
    upsertGauge,
    removeGauges: (root, args, context) => {
      return removeGauges._execute(context, args);
    },
    setGaugesEnabled,
  },
  Gauge: {
    source: (gauge) => Sources.findOne(gauge.sourceId),
    measurements: (gauge, {startDate, endDate}) => {
      return Measurements.find({gaugeId: gauge._id, date: {$gte: startDate, $lt: endDate}})
    },
  },
}