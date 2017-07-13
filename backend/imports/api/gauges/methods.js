import {Points} from "../points";
import {Gauges} from './collection';

export function upsertGauge({gauge: {_id, location, requestParams, ...gauge}, language}) {
  if (requestParams)
    gauge.requestParams = JSON.parse(requestParams);
  if (location) {
    location = { ...location, kind: 'gauge', name: 'Gauge: ' + gauge.name};
    const {insertedId} = Points.upsertTranslations(location._id, {[language]: location});
    gauge.location = {_id: insertedId, ...location};
  }

  if (_id)
    Gauges.updateTranslations(_id, {[language]: gauge});
  else
    _id = Gauges.insertTranslations(gauge);
  return Gauges.findOne(_id);
}