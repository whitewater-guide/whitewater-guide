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

func (w *workerEcuador) Autofill(options map[string]interface{}) ([]core.GaugeInfo, error) {
	// this list has coordinates
	list1, err := parseList2(w.ScriptName())
	if err != nil {
		return nil, err
	}
	// this list has no coordinates
	list2, err := parseList(w.ScriptName())
	if err != nil {
		return nil, err
	}
	byCode := make(map[string]core.GaugeInfo)
	for _, v := range list2 {
		byCode[v.Code] = v
	}
	for _, v := range list1 {
		byCode[v.Code] = v
	}
	result := make([]core.GaugeInfo, len(byCode))
	i := 0
	for _, v := range byCode {
		result[i] = v
		i += 1
	}
	return result, nil
}

func (w *workerEcuador) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
	return parseGauge(w.ScriptName(), options.Code)
}

func NewWorkerEcuador() core.Worker {
	return &workerEcuador{}
}
