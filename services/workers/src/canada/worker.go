package canada

import (
	"core"
	"github.com/spf13/pflag"
)

type workerCanada struct{}

func (w *workerCanada) ScriptName() string {
	return "canada"
}

func (w *workerCanada) HarvestMode() string {
	return core.AllAtOnce
}

func (w *workerCanada) FlagsToExtras(flags *pflag.FlagSet) map[string]interface{} {
	province, _ := flags.GetString("province")
	return map[string]interface{}{
		"province": province,
	}
}

func (w *workerCanada) Autofill(options map[string]interface{}) (result []core.GaugeInfo, err error) {
	stations, err := getStationList()
	if err != nil {
		return
	}
	province := ""
	if prov, ok := options["province"].(string); ok {
		province = string(prov)
	}
	for _, station := range stations {
		if province != "" && province != station.province {
			continue
		}
		result = append(result, core.GaugeInfo{
			GaugeId: core.GaugeId{
				Code:   station.id,
				Script: w.ScriptName(),
			},
			Location: core.Location{
				Longitude: station.longitude,
				Latitude:  station.latitude,
			},
			LevelUnit: "m",
			FlowUnit:  "m3/s",
			Name:      station.name,
			Url:       "https://wateroffice.ec.gc.ca/report/real_time_e.html?stn=" + station.id,
		})
	}
	return
}

func (w *workerCanada) Harvest(options core.HarvestOptions) ([]core.Measurement, error) {
	var province string
	if v, ok := options.Extras["province"].(string); ok {
		province = v
	}
	return fetchMeasurements(w.ScriptName(), province)
}

func NewWorkerCanada() core.Worker {
	return &workerCanada{}
}
