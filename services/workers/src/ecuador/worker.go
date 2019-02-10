package ecuador

import (
  "core"
  "github.com/spf13/pflag"
)

type workerEcuador struct{}

func (w *workerEcuador) ScriptName() string {
  return "ecuador"
}

func (w *workerEcuador) HarvestMode() string {
  return core.OneByOne
}

func (w *workerEcuador) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  return nil
}

func (w *workerEcuador) Autofill() ([]core.GaugeInfo, error) {
  return parseList()
}

func (w *workerEcuador) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
  return parseGauge(w.ScriptName(), options.Code)
}

func NewWorkerEcuador() core.Worker {
  return &workerEcuador{}
}
