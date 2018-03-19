package main

import (
  "core"
  "github.com/sirupsen/logrus"
  "github.com/fatih/structs"
)

func harvest(worker core.Worker, payload Payload) (int, error) {
  var saved = 0
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
  if err != nil {
    return 0, err
  }
  for _, m := range measurements {
    if lastValue, ok = lastValues[m.GaugeId]; !ok || m.Timestamp.After(lastValue.Timestamp.Time) {
      lastValues[m.GaugeId] = m
    }
  }
  if len(measurements) == 0 {
    logrus.WithFields(structs.Map(payload)).WithFields(structs.Map(payload.HarvestOptions)).Warn("harvested 0 measurements")
  }
  // Save to postgres
  saved, err = saveMeasurements(measurements)
  if saved > 0 {
    saveLastValues(lastValues)
  }
  return saved, err
}
