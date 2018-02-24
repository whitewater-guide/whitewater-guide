package main

import (
  "core"
  "github.com/spf13/pflag"
)

type worker struct{
  core.NamedWorker
}

func (w *worker) HarvestMode() string {
  return core.AllAtOnce
}

func (w *worker) Autofill() ([]core.GaugeInfo, error) {
  return parseTable()
}

func (w *worker) Harvest(_ string, _ int64, _ *pflag.FlagSet) ([]core.Measurement, error) {
  gauges, err := parseTable()
  if err != nil {
    return nil, err
  }
  measurements := make([]core.Measurement, len(gauges))
  for i, gauge := range gauges {
    measurements[i] = gauge.Measurement
  }
  return measurements, nil
}
