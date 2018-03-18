package main

import "core"

func harvest(worker core.Worker, payload Payload) ([]core.Measurement, error) {
  // get last values from redis cache
  // set since value for one-by-one scripts
  // filter since, update last values
  measurements, err := worker.Harvest(payload.HarvestOptions)
  measurements = core.FilterMeasurements(measurements, payload.Since)
  for _, m := range measurements {
    saveLastValue(m)
  }
  return measurements, err
}
