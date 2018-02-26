package main

import (
  "github.com/doomsower/whitewater/workers/core"
  "github.com/spf13/pflag"
  "fmt"
)

const numGauges = 10

type worker struct {
  core.NamedWorker
}

func (w *worker) HarvestMode() string {
  return core.AllAtOnce
}

func (w *worker) Autofill() ([]core.GaugeInfo, error) {
  res := make([]core.GaugeInfo, numGauges)
  for i := 0; i < numGauges; i++ {
    res[i] = core.GenerateRandGauge(i)
  }
  return res, nil
}

func (w *worker) Harvest(_ string, _ int64, flags *pflag.FlagSet) ([]core.Measurement, error) {
  value, _ := flags.GetFloat64("value")
  min, _ := flags.GetFloat64("min")
  max, _ := flags.GetFloat64("max")
  res := make([]core.Measurement, numGauges)
  for i := 0; i < numGauges; i++ {
    res[i] = core.GenerateRandMeasurement(fmt.Sprintf("g%03d", i), value, min, max)
  }

  return res, nil
}
