package all_at_once

import (
  "core"
  "github.com/spf13/pflag"
  "fmt"
)

const numGauges = 10

type workerAllAtOnce struct{}

func (w *workerAllAtOnce) ScriptName() string {
  return "all_at_once"
}

func (w *workerAllAtOnce) HarvestMode() string {
  return core.AllAtOnce
}

func (w *workerAllAtOnce) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  value, _ := flags.GetFloat64("value")
  min, _ := flags.GetFloat64("min")
  max, _ := flags.GetFloat64("max")
  return map[string]interface{}{
    "value": value,
    "min":   min,
    "max":   max,
  }
}

func (w *workerAllAtOnce) Autofill() ([]core.GaugeInfo, error) {
  res := make([]core.GaugeInfo, numGauges)
  for i := 0; i < numGauges; i++ {
    res[i] = core.GenerateRandGauge(w.ScriptName(), i)
  }
  return res, nil
}

func (w *workerAllAtOnce) Harvest(opts core.HarvestOptions) ([]core.Measurement, error) {
  var value, min, max float64
  if v, ok := opts.Extras["value"]; ok {
    value = v.(float64)
  }
  if v, ok := opts.Extras["min"]; ok {
    min = v.(float64)
  }
  if v, ok := opts.Extras["max"]; ok {
    max = v.(float64)
  }
  res := make([]core.Measurement, numGauges)
  for i := 0; i < numGauges; i++ {
    res[i] = core.GenerateRandMeasurement(w.ScriptName(), fmt.Sprintf("g%03d", i), value, min, max)
  }

  return res, nil
}

func NewWorkerAllAtOnce() core.Worker {
  return &workerAllAtOnce{}
}
