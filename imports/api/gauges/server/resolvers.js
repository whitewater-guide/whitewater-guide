import {Sources} from '../../sources';
import {Gauges, createGauge, editGauge, removeGauge, setEnabled, removeAllGauges, removeDisabledGauges} from '../index';
import _ from 'lodash';

export default {
  Query: {
    gauges: (root, {sourceId, language, skip = 0, limit = 10}) => {
      const query = sourceId ? {sourceId} : {};
      limit = _.clamp(limit, 10, 100);
      return Gauges.find(query, {sort: {name: 1}, lang: language, skip, limit});
    },
    gauge: (root, {_id, language}) => Gauges.findOne({_id}, {lang: language}),
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
    removeGauge: (root, data, context) => {
      removeGauge._execute(context, data);
      return true;
    },
    setGaugesEnabled: (root, {gaugeId, sourceId, enabled}, context) => {
      setEnabled._execute(context, {gaugeId, sourceId, enabled});
      return Gauges.find({gaugeId, sourceId});
    },
    removeAllGauges: (root, data, context) => {
      return removeAllGauges._execute(context, data);
    },
    removeDisabledGauges: (root, data, context) => {
      return removeDisabledGauges._execute(context, data);
    },
  },
  Gauge: {
    source: (gauge) => Sources.findOne(gauge._id),
  },
}