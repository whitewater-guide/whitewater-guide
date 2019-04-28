package georgia

import (
	"core"
	"github.com/spf13/pflag"
)

type workerGeorgia struct{}

func (w *workerGeorgia) ScriptName() string {
	return "georgia"
}

func (w *workerGeorgia) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerGeorgia) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerGeorgia) Autofill(options map[string]interface{}) ([]core.GaugeInfo, error) {
	return w.parseTable()
}

func (w *workerGeorgia) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
	gauges, err := w.parseTable()
	if err != nil {
		return nil, err
	}
	measurements := make([]core.Measurement, len(gauges))
	for i, gauge := range gauges {
		measurements[i] = gauge.Measurement
	}
	return measurements, nil
}

func NewWorkerGeorgia() core.Worker {
	return &workerGeorgia{}
}
