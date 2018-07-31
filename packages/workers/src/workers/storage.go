package main

import (
  "core"
)

type DatabaseManager interface {
  SaveMeasurements(measurements []core.Measurement) (int, error)
}

type CacheManager interface {
  SaveOpLog(script, code string, err error, count int)
  LoadLastMeasurements(script, code string) map[core.GaugeId]core.Measurement
  SaveLastMeasurements(values map[core.GaugeId]core.Measurement)
}
