package sepa

import (
  "core"
  "github.com/spf13/pflag"
)

type workerSepa struct{}

func (w *workerSepa) ScriptName() string {
  return "sepa"
}

func (w *workerSepa) HarvestMode() string {
  return core.OneByOne
}

func (w *workerSepa) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
  version, _ := flags.GetFloat64("version")
  html, _ := flags.GetBool("html")
  return map[string]interface{}{
    "version": version,
    "html":    html,
  }
}

func (w *workerSepa) Autofill() ([]core.GaugeInfo, error) {
  return parseList(w.ScriptName())
}

func (w *workerSepa) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
  return parseMeasurements(options.Code, w.ScriptName())
}

func NewWorkerSepa() core.Worker {
  return &workerSepa{}
}
