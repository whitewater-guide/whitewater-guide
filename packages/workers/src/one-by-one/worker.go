package main

import (
  "github.com/doomsower/whitewater/workers/core"
  "github.com/spf13/pflag"
)

type worker struct {
  core.NamedWorker
}

func (w *worker) HarvestMode() string {
  return core.OneByOne
}

func (w *worker) Autofill() ([]core.GaugeInfo, error) {
  const numGauges = 60
  res := make([]core.GaugeInfo, numGauges)
  for i := 0; i < numGauges; i++ {
    res[i] = core.GenerateRandGauge(i)
  }
  return res, nil
}

func (w *worker) Harvest(code string, _ int64, flags *pflag.FlagSet) ([]core.Measurement, error) {
  value, _ := flags.GetFloat64("value")
  min, _ := flags.GetFloat64("min")
  max, _ := flags.GetFloat64("max")
  res := make([]core.Measurement, 1)
  res[0] = core.GenerateRandMeasurement(code, value, min, max)
  return res, nil
}
