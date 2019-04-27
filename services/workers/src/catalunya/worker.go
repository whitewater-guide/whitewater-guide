package catalunya

import (
	"core"
	"github.com/spf13/pflag"
)

type workerCatalunya struct{}

func (w *workerCatalunya) ScriptName() string {
	return "catalunya"
}

func (w *workerCatalunya) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerCatalunya) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerCatalunya) Autofill(options map[string]interface{}) (gauges []core.GaugeInfo, err error) {
	return parseList(w.ScriptName())
}

func (w *workerCatalunya) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
	return parseObservations(w.ScriptName())
}

func NewWorkerCatalunya() core.Worker {
	return &workerCatalunya{}
}
