package tirol

import (
	"core"
	"encoding/json"
	"fmt"
	"github.com/spf13/pflag"
)

const dataURL = "https://apps.tirol.gv.at/hydro/stationdata/data.json"

type workerTirol struct{}

func (w *workerTirol) ScriptName() string {
	return "tirol"
}

func (w *workerTirol) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerTirol) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	return nil
}

func (w *workerTirol) Autofill() (result []core.GaugeInfo, err error) {
	resp, err := core.Client.Get(dataURL)

	if err != nil {
		return
	}
	defer resp.Body.Close()
	gauges := make([]Gauge, 0)
	err = json.NewDecoder(resp.Body).Decode(&gauges)
	if err != nil {
		return nil, err
	}

	for _, gauge := range gauges {
		if gauge.Values.Flows.Value.Value == 0 && gauge.Values.Levels.Value.Value == 0 {
			continue
		}
		flowUnit := "m3/s"
		if gauge.Values.Flows.Value.Unit != "" {
			flowUnit = gauge.Values.Flows.Value.Unit
		}
		levelUnit := "cm"
		if gauge.Values.Levels.Value.Unit != "" {
			levelUnit = gauge.Values.Levels.Value.Unit
		}
		info := core.GaugeInfo{
			GaugeId: core.GaugeId{
				Script: w.ScriptName(),
				Code:   gauge.Code,
			},
			Name: fmt.Sprintf("%s / %s", gauge.WtoObject, gauge.Name),
			Location: core.Location{
				Latitude:  gauge.Latitude,
				Longitude: gauge.Longitude,
				Altitude:  gauge.Altitude,
			},
			FlowUnit:  flowUnit,
			LevelUnit: levelUnit,
			Url:       "https://apps.tirol.gv.at/hydro/#/Wasserstand/?station=" + gauge.Code,
			Measurement: core.Measurement{
				GaugeId: core.GaugeId{
					Script: w.ScriptName(),
					Code:   gauge.Code,
				},
				Flow:      gauge.Values.Flows.Value.Value,
				Level:     gauge.Values.Levels.Value.Value,
				Timestamp: core.HTime{gauge.Values.Levels.Value.Timestamp.Time},
			},
		}
		result = append(result, info)
	}

	return result, nil
}

func (w *workerTirol) Harvest(_ core.HarvestOptions) ([]core.Measurement, error) {
	infos, err := w.Autofill()
	if err != nil {
		return nil, err
	}
	result := make([]core.Measurement, len(infos))
	for i, info := range infos {
		result[i] = info.Measurement
	}
	return result, nil
}

func NewWorkerTirol() core.Worker {
	return &workerTirol{}
}
