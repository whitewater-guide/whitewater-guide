package one_by_one

import (
	"core"
	"github.com/spf13/pflag"
)

type workerOneByOne struct{}

func (w *workerOneByOne) ScriptName() string {
	return "one_by_one"
}

func (w *workerOneByOne) HarvestMode() string {
	return core.OneByOne
}

func (w *workerOneByOne) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	value, _ := flags.GetFloat64("value")
	min, _ := flags.GetFloat64("min")
	max, _ := flags.GetFloat64("max")
	return map[string]interface{}{
		"value": value,
		"min":   min,
		"max":   max,
	}
}

func (w *workerOneByOne) Autofill(options map[string]interface{}) ([]core.GaugeInfo, error) {
	const numGauges = 60
	res := make([]core.GaugeInfo, numGauges)
	for i := 0; i < numGauges; i++ {
		res[i] = core.GenerateRandGauge(w.ScriptName(), i)
	}
	return res, nil
}

func (w *workerOneByOne) Harvest(opts core.HarvestOptions) ([]core.Measurement, error) {
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
	res := make([]core.Measurement, 1)
	res[0] = core.GenerateRandMeasurement(w.ScriptName(), opts.Code, value, min, max)
	return res, nil
}

func NewWorkerOneByOne() core.Worker {
	return &workerOneByOne{}
}
