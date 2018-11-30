package switzerland

import (
	"core"
	"encoding/json"
	"fmt"
	"github.com/spf13/pflag"
)

const dataURL = "https://apps.switzerland.gv.at/hydro/stationdata/data.json"

type workerSwitzerland struct{}

func (w *workerSwitzerland) ScriptName() string {
	return "switzerland"
}

func (w *workerSwitzerland) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerSwitzerland) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerSwitzerland) Autofill() (result []core.GaugeInfo, err error) {
	result, err = parseXML(w.ScriptName())
	if err != nil {
		return nil, nil
	}

}

func (w *workerSwitzerland) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
	infos, err := parseXML(w.ScriptName())
	if err != nil {
		return nil, nil
	}
	result := make([]core.Measurement, len(infos))
	for i, v := range infos {
		result[i] = v.Measurement
	}
	return result, nil
}

func NewWorkerSwitzerland() core.Worker {
	return &workerSwitzerland{}
}
