import {Measurements} from '../index';
import {Gauges} from '../../gauges';
import {Sections} from '../../sections';

Measurements._ensureIndex({ gaugeId: 1, date: -1 }, { unique: true });

//denormalize gauges and sections
Measurements.after.insert(function (userId, doc) {
  Gauges.update(
    doc.gaugeId,
    {$set: {lastTimestamp: doc.date, lastValue: doc.value}}
  );
  Sections.update(
    {gaugeId: doc.gaugeId},
    {$set: {"levels.lastTimestamp": doc.date, "levels.lastValue": doc.value}},
    {multi: true}
  );
});