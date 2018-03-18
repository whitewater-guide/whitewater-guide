package main

import "core"

func harvest(worker core.Worker, payload Payload) ([]core.Measurement, error) {
  var lastValue core.Measurement
  var ok bool
  // get last values from redis cache
  lastValues := loadLastValues(payload.Script, payload.Code)
  // set since value for one-by-one scripts
  if worker.HarvestMode() == core.OneByOne {
    key := core.GaugeId{Script: payload.Script, Code: payload.Code }
    if lastValue, ok = lastValues[key]; ok {
      payload.Since = lastValue.Timestamp.UTC().Unix()
    }
  }
  // filter since, update last values
  measurements, err := worker.Harvest(payload.HarvestOptions)
  for _, m := range measurements {
    // Omit measurements where both flow and level are 0
    // Omit measurements that are too old
    if (m.Flow == 0.0 && m.Level == 0.0) || (m.Timestamp.Unix() <= payload.Since) {
      continue
    }

    if lastValue, ok = lastValues[m.GaugeId]; !ok || m.Timestamp.After(lastValue.Timestamp.Time) {
      lastValues[m.GaugeId] = m
    }
    // Save to postgres here
  }
  saveLastValues(lastValues)
  return measurements, err
}
